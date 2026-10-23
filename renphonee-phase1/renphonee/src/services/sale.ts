import { z } from "zod";
import { prisma } from "@/lib/db";

export const saleSchema = z.object({
  customer: z.object({ name: z.string().min(2, "Nama customer wajib diisi"), phone: z.string().optional() }),
  items: z.array(z.object({ productId: z.string(), sellPrice: z.number().int().positive() })).min(1),
  paymentMethod: z.enum(["CASH", "TRANSFER", "QRIS", "DP", "CICILAN"]),
  paymentStatus: z.enum(["PAID", "PARTIAL", "UNPAID"]),
  paidAmount: z.number().int().min(0).optional(), // wajib untuk DP / cicilan
  notes: z.string().optional(),
});

/**
 * Satu transaksi database: produk -> SOLD, sale + sale_items (snapshot modal),
 * pemasukan, dan riwayat stok. Gagal di salah satu langkah = semuanya dibatalkan.
 */
export async function createSale(input: unknown, actor: { userId: string; employeeId?: string }) {
  const data = saleSchema.parse(input);
  const ids = data.items.map((i) => i.productId);

  return prisma.$transaction(async (tx) => {
    // Kunci status dulu agar dua orang tidak menjual unit yang sama.
    const locked = await tx.product.updateMany({
      where: { id: { in: ids }, status: { in: ["AVAILABLE", "RESERVED"] } },
      data: { status: "SOLD" },
    });
    if (locked.count !== ids.length) throw new Error("Ada unit yang sudah terjual atau tidak ditemukan.");

    const products = await tx.product.findMany({ where: { id: { in: ids } } });
    const customer = await tx.customer.create({ data: data.customer });
    const seq = (await tx.sale.count()) + 1;

    const sale = await tx.sale.create({
      data: {
        invoiceNo: `INV-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`,
        customerId: customer.id,
        employeeId: actor.employeeId,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        notes: data.notes,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            sellPrice: i.sellPrice,
            costPrice: products.find((p) => p.id === i.productId)!.costPrice, // modal diambil dari produk
          })),
        },
      },
    });

    const total = data.items.reduce((s, i) => s + i.sellPrice, 0);
    const received = data.paymentStatus === "PAID" ? total : data.paidAmount ?? 0;
    if (received > 0) {
      await tx.income.create({ data: { category: "PENJUALAN_IPHONE", amount: received, saleId: sale.id } });
    }
    await tx.stockLog.createMany({
      data: ids.map((productId) => ({ productId, action: "SOLD", byUserId: actor.userId })),
    });
    return sale;
  });
}

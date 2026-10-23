"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { assertCan } from "@/lib/permissions";

const schema = z.object({
  model: z.string().min(2), storage: z.string().min(1), color: z.string().min(1),
  imei: z.string().optional(),
  batteryHealth: z.coerce.number().int().min(1).max(100).optional(),
  conditionGrade: z.string().min(1), completeness: z.string().min(1),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]),
  costPrice: z.coerce.number().int().positive(), sellPrice: z.coerce.number().int().positive(),
  notes: z.string().optional(),
});

export async function saveProduct(id: string | null, fd: FormData) {
  const s = requireSession();
  assertCan(s.role, "product:write");
  const d = schema.parse(Object.fromEntries([...fd].map(([k, v]) => [k, v === "" ? undefined : v])));
  const data = { ...d, imei: d.imei ?? null, batteryHealth: d.batteryHealth ?? null, notes: d.notes ?? null };
  if (id) {
    await prisma.product.update({ where: { id }, data });
    await prisma.stockLog.create({ data: { productId: id, action: "EDIT", byUserId: s.email } });
  } else {
    const slug = `${[d.model, d.storage, d.color].join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).slice(2, 6)}`;
    const p = await prisma.product.create({ data: { ...data, slug, sku: `RP-${Date.now().toString(36).toUpperCase()}` } });
    await prisma.stockLog.create({ data: { productId: p.id, action: "IN", byUserId: s.email } });
  }
  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

export async function deleteProduct(id: string) {
  const s = requireSession();
  assertCan(s.role, "product:write");
  if (await prisma.saleItem.count({ where: { productId: id } })) {
    throw new Error("Produk ini sudah ada di transaksi. Ubah statusnya saja, jangan dihapus.");
  }
  await prisma.stockLog.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

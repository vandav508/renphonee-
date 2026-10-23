import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Data demo. Harga hanya contoh, bukan harga pasar.
const items = [
  ["iPhone 11", "64GB", "Black", 84, "Fullset", 3400000, 4100000, "AVAILABLE"],
  ["iPhone 11", "128GB", "Purple", 86, "Unit only", 3800000, 4500000, "AVAILABLE"],
  ["iPhone 12", "128GB", "Blue", 86, "Unit only", 4800000, 5600000, "AVAILABLE"],
  ["iPhone 13", "128GB", "Midnight", 89, "Fullset", 6000000, 7000000, "AVAILABLE"],
  ["iPhone 13 Pro", "128GB", "Sierra Blue", 88, "iBox", 8200000, 9300000, "RESERVED"],
  ["iPhone 14", "128GB", "Starlight", 92, "iBox", 8000000, 9300000, "SOLD"],
  ["iPhone 15", "128GB", "Pink", 97, "Fullset", 10500000, 11800000, "AVAILABLE"],
] as const;

async function main() {
  for (const [model, storage, color, battery, kit, cost, sell, status] of items) {
    const slug = `${model}-${storage}-${color}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: { slug, sku: `RP-${slug}`.toUpperCase().slice(0, 24), model, storage, color, batteryHealth: battery,
        conditionGrade: "98%", completeness: kit, costPrice: cost, sellPrice: sell, status },
    });
  }
  const sold = await prisma.product.findFirst({ where: { status: "SOLD" } });
  if (sold && !(await prisma.sale.count())) {
    const c = await prisma.customer.create({ data: { name: "Budi (contoh)", phone: "0812000000" } });
    await prisma.sale.create({
      data: { invoiceNo: "INV-DEMO-0001", customerId: c.id, paymentMethod: "TRANSFER", paymentStatus: "PAID",
        items: { create: [{ productId: sold.id, costPrice: sold.costPrice, sellPrice: sold.sellPrice }] },
        incomes: { create: [{ category: "PENJUALAN_IPHONE", amount: sold.sellPrice }] } },
    });
  }
}
main().finally(() => prisma.$disconnect());

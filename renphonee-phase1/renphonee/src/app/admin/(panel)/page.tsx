import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import { startOfDayWIB, startOfMonthWIB, fmtDate } from "@/lib/date";

export const dynamic = "force-dynamic";

async function range(from: Date) {
  const a = await prisma.saleItem.aggregate({ where: { sale: { date: { gte: from } } }, _sum: { sellPrice: true, costPrice: true } });
  const omzet = a._sum.sellPrice ?? 0;
  return { omzet, laba: omzet - (a._sum.costPrice ?? 0) };
}

export default async function Dashboard() {
  const [available, sold, stock, today, month, recent] = await Promise.all([
    prisma.product.count({ where: { status: "AVAILABLE" } }),
    prisma.product.count({ where: { status: "SOLD" } }),
    prisma.product.aggregate({ where: { status: { not: "SOLD" } }, _sum: { costPrice: true } }),
    range(startOfDayWIB()),
    range(startOfMonthWIB()),
    prisma.sale.findMany({ take: 5, orderBy: { date: "desc" }, include: { customer: true, items: { include: { product: true } } } }),
  ]);
  const cards = [
    ["Omzet Hari Ini", formatRupiah(today.omzet)],
    ["Omzet Bulan Ini", formatRupiah(month.omzet)],
    ["Laba Hari Ini", formatRupiah(today.laba)],
    ["Laba Bulan Ini", formatRupiah(month.laba)],
    ["Stok Tersedia", String(available)],
    ["Produk Terjual", String(sold)],
    ["Nilai Stok (modal)", formatRupiah(stock._sum.costPrice ?? 0)],
  ];
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="mt-2 text-xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-8 text-lg font-bold tracking-tight">Transaksi terbaru</h2>
      <ul className="mt-3 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
        {recent.map((s) => (
          <li key={s.id}>
            <Link href={`/admin/penjualan/${s.id}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50">
              <span><b>{s.customer.name}</b> · {s.items.map((i) => `${i.product.model} ${i.product.storage}`).join(", ")}</span>
              <span className="text-neutral-500">{fmtDate(s.date)} · {formatRupiah(s.items.reduce((a, i) => a + i.sellPrice, 0))}</span>
            </Link>
          </li>
        ))}
        {!recent.length && <li className="px-4 py-8 text-center text-sm text-neutral-500">Belum ada transaksi.</li>}
      </ul>
    </>
  );
}

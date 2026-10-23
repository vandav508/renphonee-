import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import { fmtDate } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function Sales({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q;
  const sales = await prisma.sale.findMany({
    where: q ? { OR: [{ invoiceNo: { contains: q, mode: "insensitive" } }, { customer: { name: { contains: q, mode: "insensitive" } } }] } : {},
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { date: "desc" },
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Penjualan</h1>
        <Link href="/admin/penjualan/baru" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">+ Transaksi</Link>
      </div>
      <form className="mt-5 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Cari no. invoice atau customer" className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm" />
        <button className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white">Cari</button>
      </form>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>{["Invoice", "Tanggal", "Customer", "Produk", "Total", "Laba", "Bayar"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {sales.map((s) => {
              const total = s.items.reduce((a, i) => a + i.sellPrice, 0);
              const laba = s.items.reduce((a, i) => a + i.sellPrice - i.costPrice, 0);
              return (
                <tr key={s.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-semibold"><Link href={`/admin/penjualan/${s.id}`}>{s.invoiceNo}</Link></td>
                  <td className="px-4 py-3">{fmtDate(s.date)}</td>
                  <td className="px-4 py-3">{s.customer.name}</td>
                  <td className="px-4 py-3">{s.items.map((i) => `${i.product.model} ${i.product.storage}`).join(", ")}</td>
                  <td className="px-4 py-3">{formatRupiah(total)}</td>
                  <td className="px-4 py-3 font-semibold text-brand">{formatRupiah(laba)}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold">{s.paymentStatus}</span></td>
                </tr>
              );
            })}
            {!sales.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-neutral-500">Belum ada transaksi.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

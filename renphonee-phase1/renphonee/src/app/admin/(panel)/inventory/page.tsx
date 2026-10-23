import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatRupiah, profit } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS = ["AVAILABLE", "RESERVED", "SOLD"] as const;

export default async function Inventory({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  const { q, status } = searchParams;
  const products = await prisma.product.findMany({
    where: {
      ...(q && { OR: [{ model: { contains: q, mode: "insensitive" } }, { color: { contains: q, mode: "insensitive" } }, { imei: { contains: q } }] }),
      ...(status && STATUS.includes(status as (typeof STATUS)[number]) && { status: status as (typeof STATUS)[number] }),
    },
    orderBy: { dateIn: "desc" },
  });
  const field = "rounded-xl border border-neutral-300 px-4 py-2.5 text-sm";
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
        <Link href="/admin/inventory/new" className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">+ Tambah</Link>
      </div>
      <form className="mt-5 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Cari model, warna, IMEI" className={`${field} min-w-0 flex-1`} />
        <select name="status" defaultValue={status ?? ""} className={field}>
          <option value="">Semua status</option>
          {STATUS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white">Cari</button>
      </form>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-neutral-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>{["Produk", "Battery", "Status", "Modal", "Jual", "Laba"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3"><Link href={`/admin/inventory/${p.id}`} className="font-semibold">{p.model} {p.storage}</Link><div className="text-neutral-500">{p.color} · {p.completeness}</div></td>
                <td className="px-4 py-3">{p.batteryHealth ? `${p.batteryHealth}%` : "-"}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold">{p.status}</span></td>
                <td className="px-4 py-3">{formatRupiah(p.costPrice)}</td>
                <td className="px-4 py-3">{formatRupiah(p.sellPrice)}</td>
                <td className="px-4 py-3 font-semibold text-brand">{formatRupiah(profit(p.sellPrice, p.costPrice))}</td>
              </tr>
            ))}
            {!products.length && <tr><td colSpan={6} className="px-4 py-10 text-center text-neutral-500">Belum ada produk.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

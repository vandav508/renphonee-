import { prisma } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import { createSaleAction } from "../actions";

export const dynamic = "force-dynamic";

const box = "mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm";

export default async function NewSale({ searchParams }: { searchParams: { error?: string } }) {
  const products = await prisma.product.findMany({
    where: { status: { in: ["AVAILABLE", "RESERVED"] } },
    orderBy: { dateIn: "desc" },
  });
  return (
    <>
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Buat Transaksi</h1>
      {searchParams.error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>}
      {!products.length ? (
        <p className="text-neutral-500">Tidak ada unit tersedia. Tambahkan produk di Inventory dulu.</p>
      ) : (
        <form action={createSaleAction} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">Produk
            <select name="productId" required className={box}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.model} {p.storage} {p.color} — {formatRupiah(p.sellPrice)}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">Nama customer<input name="customerName" required className={box} /></label>
          <label className="text-sm font-medium">No. HP <span className="font-normal text-neutral-400">(opsional)</span><input name="customerPhone" className={box} /></label>
          <label className="text-sm font-medium">Harga jual (Rp) <span className="font-normal text-neutral-400">(kosong = harga di inventory)</span>
            <input name="sellPrice" type="number" className={box} />
          </label>
          <label className="text-sm font-medium">Metode pembayaran
            <select name="paymentMethod" className={box}>
              <option value="CASH">Cash</option><option value="TRANSFER">Transfer</option><option value="QRIS">QRIS</option>
              <option value="DP">DP</option><option value="CICILAN">Cicilan / manual</option>
            </select>
          </label>
          <label className="text-sm font-medium">Dibayar sekarang (Rp) <span className="font-normal text-neutral-400">(hanya untuk DP / cicilan)</span>
            <input name="paidAmount" type="number" className={box} />
          </label>
          <label className="text-sm font-medium">Catatan <span className="font-normal text-neutral-400">(opsional)</span><input name="notes" className={box} /></label>
          <button className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark sm:col-span-2 sm:w-fit">Simpan Transaksi</button>
        </form>
      )}
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import { fmtDate } from "@/lib/date";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function SaleDetail({ params }: { params: { id: string } }) {
  const sale = await prisma.sale.findUnique({
    where: { id: params.id },
    include: { customer: true, incomes: true, items: { include: { product: true } } },
  });
  if (!sale) notFound();
  const total = sale.items.reduce((a, i) => a + i.sellPrice, 0);
  const laba = sale.items.reduce((a, i) => a + i.sellPrice - i.costPrice, 0);
  const paid = sale.incomes.reduce((a, i) => a + i.amount, 0);

  return (
    <>
      <div className="no-print mb-5 flex items-center justify-between">
        <Link href="/admin/penjualan" className="text-sm font-medium text-brand">← Riwayat</Link>
        <PrintButton />
      </div>
      <article className="mx-auto max-w-2xl rounded-2xl border border-neutral-200 p-7">
        <div className="flex justify-between">
          <div><p className="text-lg font-bold tracking-tight">Renphonee</p><p className="text-sm text-neutral-500">Jual Beli iPhone Lumajang</p></div>
          <div className="text-right"><p className="font-bold">INVOICE</p><p className="text-sm text-neutral-500">{sale.invoiceNo}</p><p className="text-sm text-neutral-500">{fmtDate(sale.date)}</p></div>
        </div>
        <div className="mt-6 text-sm"><p className="text-neutral-500">Kepada</p><p className="font-semibold">{sale.customer.name}</p>{sale.customer.phone && <p>{sale.customer.phone}</p>}</div>
        <table className="mt-6 w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500"><tr><th className="py-2 font-medium">Produk</th><th className="py-2 text-right font-medium">Harga</th></tr></thead>
          <tbody>
            {sale.items.map((i) => (
              <tr key={i.id} className="border-b border-neutral-100">
                <td className="py-3"><p className="font-semibold">{i.product.model} {i.product.storage} {i.product.color}</p><p className="text-neutral-500">{i.product.completeness}{i.product.imei ? ` · IMEI ${i.product.imei}` : ""}</p></td>
                <td className="py-3 text-right">{formatRupiah(i.sellPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="mt-4 ml-auto w-64 space-y-1 text-sm">
          <div className="flex justify-between font-bold"><dt>Total</dt><dd>{formatRupiah(total)}</dd></div>
          <div className="flex justify-between"><dt>Dibayar ({sale.paymentMethod})</dt><dd>{formatRupiah(paid)}</dd></div>
          {total > paid && <div className="flex justify-between text-red-600"><dt>Sisa</dt><dd>{formatRupiah(total - paid)}</dd></div>}
        </dl>
        {sale.notes && <p className="mt-6 text-sm text-neutral-500">Catatan: {sale.notes}</p>}
        <p className="mt-8 text-center text-xs text-neutral-400">Terima kasih telah berbelanja di Renphonee.</p>
      </article>
      <p className="no-print mx-auto mt-4 max-w-2xl text-sm text-neutral-500">Internal — modal {formatRupiah(sale.items.reduce((a, i) => a + i.costPrice, 0))}, laba <b className="text-brand">{formatRupiah(laba)}</b></p>
    </>
  );
}

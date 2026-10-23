import Link from "next/link";
import { formatRupiah } from "@/lib/format";

const WA = "https://wa.me/62XXXXXXXXXXX"; // ganti dengan nomor WhatsApp Renphonee

// Data dummy; akan diganti query Prisma saat inventory selesai. Harga bukan harga pasar.
const demo = [
  { id: "1", name: "iPhone 13", storage: "128GB", color: "Midnight", battery: 89, kit: "Fullset", status: "AVAILABLE", price: 7000000 },
  { id: "2", name: "iPhone 12", storage: "128GB", color: "Blue", battery: 86, kit: "Unit only", status: "AVAILABLE", price: 5600000 },
  { id: "3", name: "iPhone 14", storage: "128GB", color: "Starlight", battery: 92, kit: "iBox", status: "SOLD", price: 9300000 },
  { id: "4", name: "iPhone 11", storage: "64GB", color: "Black", battery: 84, kit: "Fullset", status: "AVAILABLE", price: 4100000 },
];

export default function HomePage() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="text-lg font-bold tracking-tight">Renphonee</span>
        <nav className="hidden gap-7 text-sm text-neutral-600 md:flex">
          <Link href="/">Home</Link>
          <Link href="/produk">Produk</Link>
          <Link href="/tentang-kami">Tentang Kami</Link>
          <Link href="/cara-pembelian">Cara Pembelian</Link>
          <Link href="/kontak">Kontak</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pt-24">
        <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          Jual Beli iPhone Lumajang
        </h1>
        <p className="mt-5 text-lg text-neutral-600">iPhone Original • Second Inter • iBox</p>
        <p className="mt-2 max-w-xl text-neutral-500">
          Kondisi 97%–99%, battery health dicantumkan di setiap unit. COD tersedia untuk Lumajang dan sekitarnya.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/produk" className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
            Lihat Produk
          </Link>
          <a href={WA} className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            Hubungi WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <h2 className="text-2xl font-bold tracking-tight">Unit tersedia</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demo.map((p) => (
            <article key={p.id} className="rounded-2xl border border-neutral-200 p-4 shadow-sm">
              <div className="relative flex aspect-[4/5] items-center justify-center rounded-xl bg-neutral-100 text-sm text-neutral-400">
                Foto produk
                {p.status === "SOLD" && (
                  <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">SOLD</span>
                )}
              </div>
              <h3 className="mt-4 font-semibold">{p.name} {p.storage}</h3>
              <p className="text-sm text-neutral-500">{p.color} · {p.kit}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Battery health</span><span>{p.battery}%</span>
                </div>
                <div className="mt-1 h-1 rounded-full bg-neutral-200">
                  <div className="h-1 rounded-full bg-brand" style={{ width: `${p.battery}%` }} />
                </div>
              </div>
              <p className="mt-4 text-lg font-bold">{formatRupiah(p.price)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

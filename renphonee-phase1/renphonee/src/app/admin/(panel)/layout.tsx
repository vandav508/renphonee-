import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";

// Menu baru (Penjualan, Keuangan, dst.) cukup ditambah di sini.
const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/penjualan", label: "Penjualan" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  if (!session) redirect("/admin/login");
  async function logout() {
    "use server";
    clearSession();
    redirect("/admin/login");
  }
  const links = NAV.map((n) => (
    <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
      {n.label}
    </Link>
  ));
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-60 shrink-0 border-r border-neutral-200 p-5 md:block">
        <p className="mb-6 text-lg font-bold tracking-tight">Renphonee</p>
        <nav className="flex flex-col gap-1">{links}</nav>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <span className="text-sm text-neutral-500">{session.email} · {session.role}</span>
          <form action={logout}><button className="text-sm font-medium text-brand">Keluar</button></form>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 px-3 py-2 md:hidden">{links}</nav>
        <main className="mx-auto max-w-5xl p-5">{children}</main>
      </div>
    </div>
  );
}

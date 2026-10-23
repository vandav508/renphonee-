import { redirect } from "next/navigation";
import { verifyLogin, setSession } from "@/lib/auth";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  async function login(fd: FormData) {
    "use server";
    const u = verifyLogin(String(fd.get("email")), String(fd.get("password")));
    if (!u) redirect("/admin/login?error=1");
    setSession(u);
    redirect("/admin");
  }
  const input = "mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm";
  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-neutral-200 p-7 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight">Renphonee Admin</h1>
        <p className="mt-1 text-sm text-neutral-500">Masuk untuk mengelola toko.</p>
        {searchParams.error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">Email atau password salah.</p>}
        <label className="mt-5 block text-sm font-medium">Email<input name="email" type="email" required className={input} /></label>
        <label className="mt-4 block text-sm font-medium">Password<input name="password" type="password" required className={input} /></label>
        <button className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-800">Masuk</button>
      </form>
    </main>
  );
}

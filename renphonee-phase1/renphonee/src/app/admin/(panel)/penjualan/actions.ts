"use server";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { assertCan } from "@/lib/permissions";
import { createSale } from "@/services/sale";

export async function createSaleAction(fd: FormData) {
  const s = requireSession();
  assertCan(s.role, "sale:create");
  const t = (k: string) => String(fd.get(k) ?? "").trim();

  const productId = t("productId");
  const product = await prisma.product.findUnique({ where: { id: productId } });
  const sellPrice = Number(t("sellPrice")) || product?.sellPrice || 0; // kosong = pakai harga di inventory
  const method = t("paymentMethod");
  const paid = Number(t("paidAmount")) || 0;
  const partial = (method === "DP" || method === "CICILAN") && paid < sellPrice;

  let id = "";
  try {
    const sale = await createSale(
      {
        customer: { name: t("customerName"), phone: t("customerPhone") || undefined },
        items: [{ productId, sellPrice }],
        paymentMethod: method,
        paymentStatus: partial ? "PARTIAL" : "PAID",
        paidAmount: partial ? paid : undefined,
        notes: t("notes") || undefined,
      },
      { userId: s.email },
    );
    id = sale.id;
  } catch (e) {
    const msg = e instanceof ZodError ? "Cek lagi isian formulir." : e instanceof Error ? e.message : "Gagal menyimpan.";
    redirect(`/admin/penjualan/baru?error=${encodeURIComponent(msg)}`);
  }
  ["/admin", "/admin/penjualan", "/admin/inventory"].forEach((p) => revalidatePath(p));
  redirect(`/admin/penjualan/${id}`);
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "../ProductForm";
import { saveProduct, deleteProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();
  return (
    <>
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Edit {product.model} {product.storage}</h1>
      <ProductForm product={product} action={saveProduct.bind(null, product.id)} />
      <form action={deleteProduct.bind(null, product.id)} className="mt-8">
        <button className="text-sm font-medium text-red-600">Hapus produk</button>
      </form>
    </>
  );
}

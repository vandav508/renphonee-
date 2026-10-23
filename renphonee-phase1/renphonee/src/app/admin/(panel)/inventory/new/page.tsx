import ProductForm from "../ProductForm";
import { saveProduct } from "../actions";

export default function NewProduct() {
  return (
    <>
      <h1 className="mb-5 text-2xl font-bold tracking-tight">Tambah Produk</h1>
      <ProductForm action={saveProduct.bind(null, null)} />
    </>
  );
}

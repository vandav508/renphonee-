import type { Product } from "@prisma/client";

const FIELDS = [
  ["model", "Model iPhone", "text", "iPhone 13", true],
  ["storage", "Storage", "text", "128GB", true],
  ["color", "Warna", "text", "Midnight", true],
  ["imei", "IMEI", "text", "", false],
  ["batteryHealth", "Battery Health (%)", "number", "89", false],
  ["conditionGrade", "Kondisi", "text", "98%", true],
  ["completeness", "Kelengkapan", "text", "Fullset", true],
  ["costPrice", "Harga Modal (Rp)", "number", "6000000", true],
  ["sellPrice", "Harga Jual (Rp)", "number", "7000000", true],
] as const;

const box = "mt-1 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm";

export default function ProductForm({ product, action }: { product?: Product; action: (fd: FormData) => Promise<void> }) {
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {FIELDS.map(([name, label, type, ph, req]) => (
        <label key={name} className="text-sm font-medium">
          {label}{!req && <span className="font-normal text-neutral-400"> (opsional)</span>}
          <input name={name} type={type} required={req} placeholder={ph}
            defaultValue={(product?.[name as keyof Product] as string | number | null) ?? undefined} className={box} />
        </label>
      ))}
      <label className="text-sm font-medium">Status
        <select name="status" defaultValue={product?.status ?? "AVAILABLE"} className={box}>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
        </select>
      </label>
      <label className="text-sm font-medium sm:col-span-2">Catatan <span className="font-normal text-neutral-400">(opsional)</span>
        <textarea name="notes" rows={3} defaultValue={product?.notes ?? ""} className={box} />
      </label>
      <button className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark sm:col-span-2 sm:w-fit">Simpan</button>
    </form>
  );
}

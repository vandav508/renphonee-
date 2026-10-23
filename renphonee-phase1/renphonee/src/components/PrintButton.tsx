"use client";
export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="no-print rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
      Cetak / Simpan PDF
    </button>
  );
}

# Renphonee — cara online (tanpa install apa pun di komputer)

1. **Neon** (neon.tech): buat project baru -> salin *connection string* (pilih yang biasa, bukan "pooled").
2. **GitHub**: buat repository baru, lalu upload semua isi folder ini lewat tombol "Add file -> Upload files".
   (Jangan upload file `.env`.)
3. **Netlify**: "Add new site -> Import from Git" -> pilih repository tadi.
   Di Environment variables isi:
   - DATABASE_URL  = connection string dari Neon
   - SESSION_SECRET = teks acak panjang (bebas)
   - OWNER_EMAIL   = email login Anda
   - OWNER_PASSWORD = password login Anda
   - SEED_DEMO     = true   (hapus setelah deploy pertama)
4. Klik Deploy. Tabel database dibuat otomatis saat deploy.
5. Buka `alamat-netlify-anda/admin/login`.

Mau coba di komputer: `npm install`, isi `.env`, `npx prisma db push`, `npm run db:seed`, `npm run dev`.

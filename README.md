# Portal Puskesmas Somagede

Prototype portal modern berbasis Next.js + React + TypeScript, responsive desktop/mobile, dengan public portal dan admin console 3 role:

- `super_admin`: semua akses
- `admin`: kelola konten/settings non-kritis
- `staf_informasi`: konten & agenda publik, tanpa user management/settings kritis

## Jalankan

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Membuat password hash

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('GantiPasswordKuat!', 12))"
```

Tempel hash ke `SUPERADMIN_PASSWORD_HASH`, `ADMIN_PASSWORD_HASH`, dan `STAF_PASSWORD_HASH` di `.env.local`.

## Catatan keamanan production

Prototype ini sengaja tidak membawa database user agar dapat langsung dipreview. Untuk production, pindahkan user/role ke database (mis. PostgreSQL), gunakan password hash, session store/JWT rotation yang sesuai, 2FA untuk super admin, audit log, CSRF protection untuk operasi mutasi, distributed rate limiting, secret management, backup, HTTPS, dan review CSP. Jangan pernah commit `.env.local`.

## Logo

Lambang Kabupaten Banyumas menggunakan referensi Wikimedia Commons yang mencatatnya sebagai emblem Kabupaten Banyumas. Logo GERMAS sebaiknya diunduh dari sumber resmi Kementerian Kesehatan/Ayo Sehat untuk produksi. Referensi resmi: https://ayosehat.kemkes.go.id/merchandise-germas-logo-germas

Logo spesifik Puskesmas Somagede belum ditemukan dari sumber resmi yang dapat diverifikasi dalam pencarian ini, sehingga preview memakai lambang Banyumas sebagai visual utama. Ganti `components/Logo.tsx` ketika aset resmi Puskesmas tersedia.


## Demo login awal

- Super Admin: `superadmin@puskesmas.local` / `Somagede@2026!`
- Admin: `admin@puskesmas.local` / `AdminSomagede@2026!`
- Staf Informasi: `informasi@puskesmas.local` / `StafSomagede@2026!`

Untuk production, set `AUTH_SECRET` dan kredensial/password hash melalui Environment Variables Vercel.

## Demo Login
- Super Admin: `superadmin@puskesmas.local` / `Somagede@2026!`
- Admin: `admin@puskesmas.local` / `AdminSomagede@2026!`
- Staf Informasi: `informasi@puskesmas.local` / `StafSomagede@2026!`

For production, replace demo authentication with database-backed users and bcrypt password hashes, and set a strong `AUTH_SECRET` in Vercel Environment Variables.

## Loading screen
The site now includes an animated Puskesmas Somagede splash/loading screen using the supplied Puskesmas logo. It appears on initial page load, includes an animated progress bar, floating medical accents, layered waves, responsive mobile styling, and respects `prefers-reduced-motion`.

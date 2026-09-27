-- ============================================================
-- JALANKAN INI SETELAH ANDA DAFTAR LEWAT HALAMAN /register
-- Ganti email di bawah dengan email akun Anda.
-- ============================================================
update public.profiles
set role = 'admin', is_approved = true, approved_at = now()
where email = 'admin@emailkamu.com';

-- Skema Database MySQL untuk si-MOP
-- Versi: Native SQL (Kompatibel phpMyAdmin)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- 1. Table Users
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','operator') NOT NULL DEFAULT 'operator',
  `irban_unit` enum('irban1','irban2','irban3','irbansus','sekretariat') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table PKPT Programs
CREATE TABLE `pkpt_programs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode_program` varchar(50) NOT NULL,
  `nama_kegiatan` varchar(255) NOT NULL,
  `irban_penanggung_jawab` enum('irban1','irban2','irban3','irbansus','sekretariat') NOT NULL,
  `objek_pengawasan` varchar(255) NOT NULL,
  `jenis_pengawasan` enum('audit_kinerja','audit_ketaatan','reviu','monitoring','evaluasi') NOT NULL,
  `tgl_mulai` date NOT NULL,
  `tgl_selesai` date NOT NULL,
  `status` enum('belum_mulai','persiapan','pelaksanaan','pelaporan','selesai') NOT NULL DEFAULT 'belum_mulai',
  `progres_persen` int(3) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_program` (`kode_program`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Data Seed (Password Default: 'password')
-- Hash generated via password_hash('password', PASSWORD_DEFAULT)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `irban_unit`, `created_at`, `updated_at`) VALUES
('Admin Sekretariat', 'admin@inspektorat.katingan.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'sekretariat', NOW(), NOW()),
('Operator Irban 1', 'irban1@inspektorat.katingan.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operator', 'irban1', NOW(), NOW());

COMMIT;
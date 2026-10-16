import React from 'react';

export default function RoleBanner({
  roleKey,
  role,
  onOpenAddModal,
  onResetData,
  onOpenPrintModal,
  onSwitchTab,
  mentorOnlyFilter,
  onToggleMentorFilter
}) {
  return (
    <div className="role-notice-banner" id="roleNoticeBanner">
      <div className="banner-left">
        <span className="banner-icon">{role.avatar}</span>
        <div className="banner-text">
          <h4>
            {roleKey === 'admin' && 'Akses Penuh: Administrator Kesiswaan'}
            {roleKey === 'kepala' && 'Mode Eksekutif: Kepala Madrasah'}
            {roleKey === 'guru' && `Akses Pembimbing: ${role.name}`}
          </h4>
          <p>
            {roleKey === 'admin' &&
              'Kelola data master prestasi akademik & non-akademik, validasi sertifikat, backup database, dan monitor agenda lomba.'}
            {roleKey === 'kepala' &&
              'Pantau perkembangan prestasi santri madrasah, rekapitulasi capaian tingkat nasional/internasional, dan sahkan laporan resmi.'}
            {roleKey === 'guru' &&
              'Daftarkan lomba yang akan datang, pantau jadwal persiapan, dan laporkan perolehan juara siswa bimbingan.'}
          </p>
        </div>
      </div>

      <div className="banner-actions">
        {roleKey === 'admin' && (
          <>
            <button className="btn btn-sm btn-secondary" onClick={onResetData}>
              🔄 Reset Data Contoh
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onOpenAddModal('achieved')}
            >
              ➕ Tambah Prestasi
            </button>
          </>
        )}

        {roleKey === 'kepala' && (
          <>
            <button className="btn btn-sm btn-gold" onClick={onOpenPrintModal}>
              🖨️ Cetak Rekap Resmi
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onSwitchTab('analytics')}
            >
              📊 Buka Analitik
            </button>
          </>
        )}

        {roleKey === 'guru' && (
          <>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => onOpenAddModal('upcoming')}
            >
              📅 Daftarkan Lomba Mendatang
            </button>
            <button
              className={`btn btn-sm ${mentorOnlyFilter ? 'btn-gold' : 'btn-secondary'}`}
              onClick={onToggleMentorFilter}
            >
              {mentorOnlyFilter
                ? '✓ Menampilkan Bimbingan Saya'
                : '🔍 Khusus Siswa Bimbingan Saya'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

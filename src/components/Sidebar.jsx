import React from 'react';

export default function Sidebar({
  currentRole,
  activeTab,
  onSelectTab,
  achievedCount,
  upcomingCount,
  onOpenPrintModal,
  onExportCSV,
  onOpenGuideModal,
  isMobileOpen,
  onCloseMobile
}) {
  return (
    <aside className={`app-sidebar ${isMobileOpen ? 'open' : ''}`} id="appSidebar">
      <div className="sidebar-header">
        <img src="./assets/logo.jpg" alt="Logo Madrasah" className="sidebar-logo-img" />
        <div className="sidebar-brand">
          <h1>SIPRES<span>MA</span></h1>
          <p>Portal Prestasi Siswa</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="sidebar-role-badge">
        <div className="role-badge-header">
          <span>Hak Akses Aktif</span>
          <span style={{ fontSize: '0.68rem', color: '#34d399' }}>● Online</span>
        </div>
        <div className="role-badge-user">
          <div className="role-avatar">{currentRole.avatar}</div>
          <div className="role-info-text">
            <div className="role-name">{currentRole.name}</div>
            <div className="role-title">{currentRole.roleName}</div>
          </div>
        </div>
      </div>

      {/* Sidebar Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Menu Utama</div>
        <a
          href="#achieved"
          className={`nav-item ${activeTab === 'achieved' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('achieved');
            onCloseMobile();
          }}
        >
          <span className="nav-item-icon">🏆</span>
          <span>Prestasi Diraih</span>
          <span className="nav-badge">{achievedCount}</span>
        </a>

        <a
          href="#upcoming"
          className={`nav-item ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('upcoming');
            onCloseMobile();
          }}
        >
          <span className="nav-item-icon">📅</span>
          <span>Lomba Akan Datang</span>
          <span className="nav-badge pulse">{upcomingCount}</span>
        </a>

        <a
          href="#analytics"
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('analytics');
            onCloseMobile();
          }}
        >
          <span className="nav-item-icon">📊</span>
          <span>Rekapitulasi Eksekutif</span>
        </a>

        <div className="nav-section-title">Aksi & Laporan</div>
        <a
          href="#print"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            onOpenPrintModal();
            onCloseMobile();
          }}
        >
          <span className="nav-item-icon">🖨️</span>
          <span>Cetak Rekap Resmi</span>
        </a>

        <a
          href="#export"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            onExportCSV();
            onCloseMobile();
          }}
        >
          <span className="nav-item-icon">📥</span>
          <span>Ekspor Data (CSV)</span>
        </a>

        <a
          href="#guide"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            onOpenGuideModal();
            onCloseMobile();
          }}
        >
          <span className="nav-item-icon">ℹ️</span>
          <span>Alur Peran & Panduan</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-madrasah-meta">
          <strong>MAN Unggulan Terpadu</strong><br />
          Kementerian Agama RI<br />
          <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>Tahun Ajaran 2026/2027</span>
        </div>
      </div>
    </aside>
  );
}

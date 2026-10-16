import React from 'react';

export default function Header({
  activeTab,
  roleKey,
  onChangeRole,
  theme,
  onToggleTheme,
  onOpenGuideModal,
  onToggleMobileMenu
}) {
  const getPageTitle = () => {
    switch (activeTab) {
      case 'achieved':
        return {
          title: '🏆 Rekapitulasi Prestasi yang Sudah Diraih',
          subtitle: 'Daftar pencapaian kejuaraan akademik & non-akademik santri madrasah'
        };
      case 'upcoming':
        return {
          title: '📅 Agenda & Lomba yang Akan Datang',
          subtitle: 'Pemantauan jadwal kompetisi, tahap pembinaan, dan target delegasi madrasah'
        };
      case 'analytics':
        return {
          title: '📊 Rekapitulasi & Analisis Eksekutif Prestasi',
          subtitle: 'Grafik komprehensif mutu kejuaraan untuk evaluasi Kepala Madrasah'
        };
      default:
        return { title: 'SIPRESMA', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="mobile-toggle"
          id="mobileMenuBtn"
          onClick={onToggleMobileMenu}
          aria-label="Buka Menu"
        >
          ☰
        </button>
        <div className="header-title-block">
          <h2>{title}</h2>
          <div className="header-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="header-right">
        {/* Role Switcher */}
        <div className="role-switch-container">
          <span className="role-switch-label">Pilih Peran:</span>
          <select
            id="roleSelector"
            className="role-select"
            value={roleKey}
            onChange={(e) => onChangeRole(e.target.value)}
            aria-label="Ganti Hak Akses"
          >
            <option value="admin">👨‍💼 Administrator</option>
            <option value="kepala">🎓 Kepala Madrasah</option>
            <option value="guru">👩‍🏫 Guru Pembimbing</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          title="Ganti Tema Gelap/Terang"
          aria-label="Mode Gelap"
        >
          {theme === 'dark' ? '☀️' : '🌓'}
        </button>

        {/* Help Button */}
        <button
          className="help-btn"
          onClick={onOpenGuideModal}
          title="Petunjuk Penggunaan"
          aria-label="Panduan"
        >
          ❓
        </button>
      </div>
    </header>
  );
}

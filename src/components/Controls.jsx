import React from 'react';

export default function Controls({
  activeTab,
  onSelectTab,
  achievedCount,
  upcomingCount,
  filters,
  onChangeFilter,
  viewMode,
  onChangeViewMode,
  canAdd,
  onOpenAddModal,
  onOpenPrintModal
}) {
  return (
    <section className="controls-container">
      <div className="main-tabs-row">
        <div className="tabs-group">
          <button
            className={`tab-btn ${activeTab === 'achieved' ? 'active' : ''}`}
            onClick={() => onSelectTab('achieved')}
          >
            <span>🏆 Prestasi Yang Diraih</span>
            <span className="tab-count-badge">{achievedCount}</span>
          </button>
          <button
            className={`tab-btn upcoming-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => onSelectTab('upcoming')}
          >
            <span>📅 Lomba Akan Datang</span>
            <span className="tab-count-badge">{upcomingCount}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => onSelectTab('analytics')}
          >
            <span>📊 Rekapitulasi & Grafik</span>
          </button>
        </div>

        <div className="controls-actions-right">
          {canAdd && (
            <button
              className="btn btn-primary"
              onClick={() => onOpenAddModal(activeTab === 'upcoming' ? 'upcoming' : 'achieved')}
            >
              <span>➕</span>
              <span>Tambah Prestasi / Lomba</span>
            </button>
          )}
          <button className="btn btn-secondary" onClick={onOpenPrintModal}>
            <span>🖨️</span>
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Secondary Filter Bar */}
      {activeTab !== 'analytics' && (
        <div className="filter-search-row">
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Cari nama siswa, NISN, nama kompetisi, atau pembimbing..."
              value={filters.search}
              onChange={(e) => onChangeFilter('search', e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => onChangeFilter('category', e.target.value)}
            aria-label="Filter Kategori"
          >
            <option value="all">Semua Kategori</option>
            <option value="Akademik">📘 Akademik</option>
            <option value="Non-Akademik">🎨 Non-Akademik</option>
          </select>

          <select
            className="filter-select"
            value={filters.level}
            onChange={(e) => onChangeFilter('level', e.target.value)}
            aria-label="Filter Tingkat"
          >
            <option value="all">Semua Tingkat</option>
            <option value="Internasional">🌍 Internasional</option>
            <option value="Nasional">🇮🇩 Nasional</option>
            <option value="Provinsi">🏛️ Provinsi</option>
            <option value="Kabupaten/Kota">🏢 Kabupaten/Kota</option>
          </select>

          <select
            className="filter-select"
            value={filters.year}
            onChange={(e) => onChangeFilter('year', e.target.value)}
            aria-label="Filter Tahun Ajaran"
          >
            <option value="all">Semua Tahun</option>
            <option value="2026/2027">2026/2027</option>
            <option value="2025/2026">2025/2026</option>
          </select>

          <div className="view-toggle-btns">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('grid')}
              title="Tampilan Kartu"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('table')}
              title="Tampilan Tabel"
            >
              ≡
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

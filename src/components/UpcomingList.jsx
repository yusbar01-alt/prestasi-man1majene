import React from 'react';

export default function UpcomingList({
  items,
  viewMode,
  onOpenConvertModal,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  onOpenAddModal
}) {
  const formatIndonesianDate = (dateStr) => {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Internasional':
        return 'level-internasional';
      case 'Nasional':
        return 'level-nasional';
      case 'Provinsi':
        return 'level-provinsi';
      default:
        return 'level-kabupaten';
    }
  };

  const calculateCountdown = (dateStr) => {
    if (!dateStr) return { label: 'Jadwal Ditentukan', isUrgent: false };
    const target = new Date(dateStr);
    const now = new Date('2026-10-16');
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Lewat ${Math.abs(diffDays)} Hari`, isUrgent: false };
    } else if (diffDays === 0) {
      return { label: 'Hari Ini!', isUrgent: true };
    } else if (diffDays <= 7) {
      return { label: `H-${diffDays} Hari Lagi`, isUrgent: true };
    } else {
      return { label: `H-${diffDays} Hari`, isUrgent: false };
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📅</div>
        <h4>Tidak Ada Agenda Lomba Mendatang</h4>
        <p>
          Belum ada agenda lomba mendatang yang tercatat pada filter saat ini.
          Guru pembimbing atau admin dapat mendaftarkan agenda lomba baru.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => onOpenAddModal('upcoming')}
        >
          ➕ Daftarkan Lomba Baru
        </button>
      </div>
    );
  }

  return (
    <section id="viewUpcomingSection">
      {viewMode === 'grid' ? (
        <div className="items-grid" id="upcomingGridContainer">
          {items.map((item) => {
            const levelClass = getLevelBadgeClass(item.level);
            const categoryClass =
              item.category === 'Akademik'
                ? 'category-akademik'
                : 'category-non-akademik';

            const countdown = calculateCountdown(item.competitionDate);
            const progress = item.preparationProgress || 75;

            return (
              <div className="prestasi-card" key={item.id}>
                <div className="card-top-stripe stripe-upcoming"></div>
                <div className="card-header-main">
                  <span className={`category-badge-pill ${categoryClass}`}>
                    {item.category === 'Akademik' ? '📘' : '🎨'} {item.field || item.category}
                  </span>
                  <span className={`level-badge ${levelClass}`}>{item.level}</span>
                </div>

                <div className="card-body-content">
                  <h3 className="prestasi-title" title={item.title}>
                    {item.title}
                  </h3>

                  <div className="upcoming-status-box">
                    <div className="upcoming-countdown">
                      <span
                        className={`countdown-badge ${countdown.isUrgent ? 'urgent' : ''}`}
                      >
                        ⏳ {countdown.label}
                      </span>
                      <span className="competition-date-text">
                        📅 {formatIndonesianDate(item.competitionDate)}
                      </span>
                    </div>

                    <div className="progress-header">
                      <span>{item.preparationStage || 'Tahap Persiapan'}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="prestasi-meta-list">
                    <div className="meta-row">
                      <span className="meta-label">🎯 Target</span>
                      <span className="meta-value" style={{ color: 'var(--gold-700)' }}>
                        {item.targetRank || 'Medali Emas'}
                      </span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">👤 Delegasi Siswa</span>
                      <span className="meta-value">{item.studentName}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">🏫 Kelas</span>
                      <span className="meta-value">{item.studentClass || '-'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">👨‍🏫 Pembimbing</span>
                      <span className="meta-value">{item.mentorName || '-'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">📍 Lokasi</span>
                      <span className="meta-value">
                        {item.location || item.organizer || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer-actions">
                  <button
                    className="btn btn-sm btn-gold"
                    onClick={() => onOpenConvertModal(item)}
                    title="Lomba selesai? Catat juara yang diraih siswa"
                  >
                    <span>🎉</span> Selesaikan & Catat Juara
                  </button>
                  <div className="action-btn-group">
                    {canEdit && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEdit(item)}
                        title="Edit Jadwal"
                      >
                        ✏️
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-sm btn-danger-outline"
                        onClick={() => onDelete(item.id, item.title)}
                        title="Hapus Agenda"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="custom-data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Delegasi Siswa</th>
                  <th>Nama Agenda / Lomba</th>
                  <th>Kategori</th>
                  <th>Tingkat</th>
                  <th>Target Juara</th>
                  <th>Pelaksanaan</th>
                  <th>Status Tahapan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const levelClass = getLevelBadgeClass(item.level);
                  const categoryClass =
                    item.category === 'Akademik'
                      ? 'category-akademik'
                      : 'category-non-akademik';
                  const countdown = calculateCountdown(item.competitionDate);

                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                        {index + 1}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          {item.studentName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.studentClass || '-'}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-main)',
                            maxWidth: '280px'
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.location || item.organizer || ''}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`category-badge-pill ${categoryClass}`}
                          style={{ fontSize: '0.68rem' }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`level-badge ${levelClass}`}
                          style={{ fontSize: '0.68rem' }}
                        >
                          {item.level}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--gold-700)' }}>
                        {item.targetRank || '-'}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                          {formatIndonesianDate(item.competitionDate)}
                        </div>
                        <span
                          className={`countdown-badge ${countdown.isUrgent ? 'urgent' : ''}`}
                          style={{ fontSize: '0.68rem', marginTop: '3px' }}
                        >
                          {countdown.label}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: 'var(--accent-blue)'
                          }}
                        >
                          {item.preparationStage || 'Persiapan'}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Progres {item.preparationProgress || 70}%
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="btn btn-sm btn-gold"
                            onClick={() => onOpenConvertModal(item)}
                            title="Catat Juara"
                          >
                            🎉 Selesai
                          </button>
                          {canEdit && (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => onEdit(item)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                          )}
                          {canDelete && (
                            <button
                              className="btn btn-sm btn-danger-outline"
                              onClick={() => onDelete(item.id, item.title)}
                              title="Hapus"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

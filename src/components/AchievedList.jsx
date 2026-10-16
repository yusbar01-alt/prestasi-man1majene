import React from 'react';

export default function AchievedList({
  items,
  viewMode,
  onOpenCertificate,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  onResetFilters
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

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h4>Belum Ada Data Prestasi yang Sesuai</h4>
        <p>Coba ubah kata kunci pencarian atau sesuaikan filter kategori dan tingkat kejuaraan.</p>
        <button className="btn btn-secondary" onClick={onResetFilters}>
          Reset Filter
        </button>
      </div>
    );
  }

  return (
    <section id="viewAchievedSection">
      {viewMode === 'grid' ? (
        <div className="items-grid" id="achievedGridContainer">
          {items.map((item) => {
            let stripeClass = 'stripe-emerald';
            let rankIcon = '🏅';
            const rankLower = (item.rank || '').toLowerCase();

            if (
              rankLower.includes('emas') ||
              rankLower.includes('juara 1') ||
              rankLower.includes('gold')
            ) {
              stripeClass = 'stripe-gold';
              rankIcon = '🥇';
            } else if (
              rankLower.includes('perak') ||
              rankLower.includes('juara 2') ||
              rankLower.includes('silver')
            ) {
              stripeClass = 'stripe-silver';
              rankIcon = '🥈';
            } else if (
              rankLower.includes('perunggu') ||
              rankLower.includes('juara 3') ||
              rankLower.includes('bronze')
            ) {
              stripeClass = 'stripe-bronze';
              rankIcon = '🥉';
            }

            const levelClass = getLevelBadgeClass(item.level);
            const categoryClass =
              item.category === 'Akademik'
                ? 'category-akademik'
                : 'category-non-akademik';

            return (
              <div className="prestasi-card" key={item.id}>
                <div className={`card-top-stripe ${stripeClass}`}></div>
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

                  <div className="rank-highlight-banner">
                    <span className="rank-icon-big">{rankIcon}</span>
                    <div>
                      <div className="rank-text-bold">{item.rank || 'Penghargaan'}</div>
                      <div className="rank-organizer">{item.organizer || 'Kemenag RI'}</div>
                    </div>
                  </div>

                  <div className="prestasi-meta-list">
                    <div className="meta-row">
                      <span className="meta-label">👤 Siswa</span>
                      <span className="meta-value">{item.studentName}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">🏫 Kelas / NISN</span>
                      <span className="meta-value">{item.studentClass || '-'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">👨‍🏫 Pembimbing</span>
                      <span className="meta-value">{item.mentorName || '-'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">📅 Tanggal</span>
                      <span className="meta-value">{formatIndonesianDate(item.eventDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer-actions">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onOpenCertificate(item)}
                  >
                    <span>📜</span> Sertifikat
                  </button>
                  <div className="action-btn-group">
                    {canEdit && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEdit(item)}
                        title="Edit Data"
                      >
                        ✏️
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="btn btn-sm btn-danger-outline"
                        onClick={() => onDelete(item.id, item.title)}
                        title="Hapus Data"
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
                  <th>Nama Siswa & Kelas</th>
                  <th>Nama Kejuaraan / Prestasi</th>
                  <th>Kategori</th>
                  <th>Tingkat</th>
                  <th>Peringkat / Juara</th>
                  <th>Guru Pembimbing</th>
                  <th>Tanggal</th>
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
                          {item.organizer || ''}
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
                        {item.rank || '-'}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{item.mentorName || '-'}</td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>
                        {formatIndonesianDate(item.eventDate)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => onOpenCertificate(item)}
                            title="Lihat Sertifikat"
                          >
                            📜
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

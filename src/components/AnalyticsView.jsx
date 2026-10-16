import React, { useEffect, useRef } from 'react';
import { MASTER_FIELDS } from '../data/initialData';

export default function AnalyticsView({
  records,
  onOpenPrintModal,
  onExportCSV,
  theme
}) {
  const achievedList = records.filter((r) => r.type === 'achieved');
  const upcomingList = records.filter((r) => r.type === 'upcoming');

  const donutCanvasRef = useRef(null);
  const barCanvasRef = useRef(null);

  // Render Donut Chart
  useEffect(() => {
    const canvas = donutCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 280;
    const height = 240;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const levels = ['Internasional', 'Nasional', 'Provinsi', 'Kabupaten/Kota'];
    const colors = ['#7c3aed', '#f59e0b', '#059669', '#0284c7'];
    const counts = levels.map(
      (lvl) => achievedList.filter((item) => item.level === lvl).length
    );
    const total = counts.reduce((a, b) => a + b, 0);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 85;
    const innerRadius = 52;

    if (total === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText('Belum ada data', centerX, centerY);
      return;
    }

    let startAngle = -Math.PI / 2;
    counts.forEach((count, i) => {
      if (count === 0) return;
      const sliceAngle = (count / total) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = colors[i];
      ctx.fill();

      startAngle = endAngle;
    });

    // Center text
    const isDark = theme === 'dark';
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 26px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY - 6);

    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillText('TOTAL PRESTASI', centerX, centerY + 16);
  }, [achievedList, theme]);

  // Render Bar Chart
  useEffect(() => {
    const canvas = barCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 400;
    const height = 240;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const monthLabels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const monthCounts = new Array(12).fill(0);

    achievedList.forEach((item) => {
      if (item.eventDate) {
        const monthIdx = new Date(item.eventDate).getMonth();
        if (monthIdx >= 0 && monthIdx < 12) {
          monthCounts[monthIdx]++;
        }
      }
    });

    const maxVal = Math.max(...monthCounts, 4);
    const chartHeight = 160;
    const chartTop = 30;
    const chartBottom = chartTop + chartHeight;
    const barWidth = 18;
    const spacing = (width - 40) / 12;
    const isDark = theme === 'dark';

    // Grid lines
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;

    for (let step = 0; step <= maxVal; step += Math.ceil(maxVal / 4)) {
      const y = chartBottom - (step / maxVal) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(width - 10, y);
      ctx.stroke();

      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.textAlign = 'right';
      ctx.fillText(step.toString(), 24, y + 3);
    }

    // Draw Bars
    monthCounts.forEach((val, idx) => {
      const x = 36 + idx * spacing;
      const barH = (val / maxVal) * chartHeight;
      const y = chartBottom - barH;

      const gradient = ctx.createLinearGradient(0, y, 0, chartBottom);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#047857');

      ctx.fillStyle = val > 0 ? gradient : isDark ? '#1e293b' : '#e2e8f0';

      ctx.beginPath();
      const radius = 4;
      if (ctx.roundRect) {
        ctx.roundRect(
          x,
          val > 0 ? y : chartBottom - 2,
          barWidth,
          val > 0 ? barH : 2,
          [radius, radius, 0, 0]
        );
      } else {
        ctx.rect(x, val > 0 ? y : chartBottom - 2, barWidth, val > 0 ? barH : 2);
      }
      ctx.fill();

      if (val > 0) {
        ctx.fillStyle = isDark ? '#34d399' : '#047857';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val.toString(), x + barWidth / 2, y - 6);
      }

      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(monthLabels[idx], x + barWidth / 2, chartBottom + 18);
    });
  }, [achievedList, theme]);

  const levels = ['Internasional', 'Nasional', 'Provinsi', 'Kabupaten/Kota'];
  const colors = ['#7c3aed', '#f59e0b', '#059669', '#0284c7'];
  const counts = levels.map(
    (lvl) => achievedList.filter((item) => item.level === lvl).length
  );
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <section id="viewAnalyticsSection" className="analytics-section">
      {/* Executive Banner */}
      <div className="executive-summary-banner">
        <div className="exec-text">
          <h3>🎓 Laporan Rekapitulasi Eksekutif Prestasi Madrasah</h3>
          <p>
            Ringkasan komprehensif performa kompetisi sains, riset madrasah (MYRES),
            keagamaan (MTQ/Tahfidz), robotika, seni dan olahraga untuk monitoring
            pimpinan dan evaluasi mutu pendidikan.
          </p>
        </div>
        <div className="exec-actions">
          <button className="btn btn-gold" onClick={onOpenPrintModal}>
            <span>🖨️</span> Cetak Rekap Resmi
          </button>
          <button className="btn btn-secondary" onClick={onExportCSV}>
            <span>📥</span> Unduh Format Excel
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-card-header">
            <h4>📊 Distribusi Tingkat Kejuaraan</h4>
            <span className="badge-tag-stat highlight">Semua Kategori</span>
          </div>
          <div className="chart-canvas-container">
            <canvas ref={donutCanvasRef} width="280" height="240"></canvas>
          </div>
          <div className="legend-list">
            {levels.map((lvl, i) => {
              const percentage = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
              return (
                <div className="legend-item" key={lvl}>
                  <span
                    className="legend-color-dot"
                    style={{ backgroundColor: colors[i] }}
                  ></span>
                  <span>
                    {lvl}: <strong>{counts[i]}</strong> ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h4>📈 Tren Perolehan Prestasi per Bulan</h4>
            <span className="badge-tag-stat up">Tahun 2026</span>
          </div>
          <div className="chart-canvas-container">
            <canvas ref={barCanvasRef} width="400" height="240"></canvas>
          </div>
          <div className="legend-list">
            <div className="legend-item">
              <span
                className="legend-color-dot"
                style={{ backgroundColor: '#10b981' }}
              ></span>
              <span>Total Kejuaraan Diraih per Bulan Tahun 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="table-card" style={{ marginTop: '10px' }}>
        <div
          className="modal-header"
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          <h4
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-main)'
            }}
          >
            📋 Matriks Rekapitulasi Capaian per Bidang & Kategori
          </h4>
        </div>
        <div className="table-responsive">
          <table className="custom-data-table">
            <thead>
              <tr>
                <th>Bidang Kompetisi</th>
                <th>Kategori</th>
                <th>Internasional</th>
                <th>Nasional</th>
                <th>Provinsi</th>
                <th>Kab/Kota</th>
                <th>Total Diraih</th>
                <th>Lomba Mendatang</th>
              </tr>
            </thead>
            <tbody>
              {MASTER_FIELDS.map((field) => {
                const fieldAchieved = achievedList.filter((item) => item.field === field);
                const fieldUpcoming = upcomingList.filter((item) => item.field === field);

                const intl = fieldAchieved.filter(
                  (item) => item.level === 'Internasional'
                ).length;
                const nas = fieldAchieved.filter((item) => item.level === 'Nasional').length;
                const prov = fieldAchieved.filter(
                  (item) => item.level === 'Provinsi'
                ).length;
                const kab = fieldAchieved.filter(
                  (item) => item.level === 'Kabupaten/Kota'
                ).length;
                const totalCount = fieldAchieved.length;
                const upcomingCount = fieldUpcoming.length;

                const isAcademic = [
                  'KSM Sains',
                  'Riset & Karya Ilmiah (MYRES)',
                  'Robotika & AI',
                  'Bahasa & Literasi'
                ].includes(field);

                return (
                  <tr key={field}>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {field}
                    </td>
                    <td>
                      <span
                        className={`category-badge-pill ${
                          isAcademic ? 'category-akademik' : 'category-non-akademik'
                        }`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {isAcademic ? 'Akademik' : 'Non-Akademik'}
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        fontWeight: intl > 0 ? 700 : 'normal',
                        color: intl > 0 ? '#7c3aed' : 'inherit'
                      }}
                    >
                      {intl}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        fontWeight: nas > 0 ? 700 : 'normal',
                        color: nas > 0 ? '#d97706' : 'inherit'
                      }}
                    >
                      {nas}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        fontWeight: prov > 0 ? 700 : 'normal',
                        color: prov > 0 ? '#059669' : 'inherit'
                      }}
                    >
                      {prov}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        fontWeight: kab > 0 ? 700 : 'normal',
                        color: kab > 0 ? '#0284c7' : 'inherit'
                      }}
                    >
                      {kab}
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: 'var(--primary-700)'
                      }}
                    >
                      {totalCount}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={`badge-tag-stat ${
                          upcomingCount > 0 ? 'highlight' : ''
                        }`}
                      >
                        {upcomingCount} Agenda
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

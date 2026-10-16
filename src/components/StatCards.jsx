import React from 'react';

export default function StatCards({ records }) {
  const achievedList = records.filter((r) => r.type === 'achieved');
  const upcomingList = records.filter((r) => r.type === 'upcoming');

  const totalAchieved = achievedList.length;
  const goldMedals = achievedList.filter(
    (r) =>
      r.rank &&
      (r.rank.toLowerCase().includes('emas') ||
        r.rank.toLowerCase().includes('juara 1') ||
        r.rank.toLowerCase().includes('gold'))
  ).length;

  const nationalAndAbove = achievedList.filter(
    (r) => r.level === 'Nasional' || r.level === 'Internasional'
  ).length;

  const totalUpcoming = upcomingList.length;
  const ratio = totalAchieved > 0 ? Math.round((nationalAndAbove / totalAchieved) * 100) : 0;

  return (
    <section className="stats-grid" id="statsOverview">
      <div className="stat-card card-emerald">
        <div className="stat-icon-wrapper">🏆</div>
        <div className="stat-info">
          <div className="stat-title">Total Prestasi Diraih</div>
          <div className="stat-value">{totalAchieved}</div>
          <div className="stat-subtext">
            <span className="badge-tag-stat up">↑ Aktif</span> Terverifikasi Resmi
          </div>
        </div>
      </div>

      <div className="stat-card card-gold">
        <div className="stat-icon-wrapper">🥇</div>
        <div className="stat-info">
          <div className="stat-title">Juara 1 / Medali Emas</div>
          <div className="stat-value">{goldMedals}</div>
          <div className="stat-subtext">
            <span className="badge-tag-stat highlight">Unggulan</span> Prestasi Tertinggi
          </div>
        </div>
      </div>

      <div className="stat-card card-blue">
        <div className="stat-icon-wrapper">🌍</div>
        <div className="stat-info">
          <div className="stat-title">Nasional & Internasional</div>
          <div className="stat-value">{nationalAndAbove}</div>
          <div className="stat-subtext">
            <span>{ratio}% dari Total Prestasi</span>
          </div>
        </div>
      </div>

      <div className="stat-card card-purple">
        <div className="stat-icon-wrapper">⏳</div>
        <div className="stat-info">
          <div className="stat-title">Lomba Akan Berlangsung</div>
          <div className="stat-value">{totalUpcoming}</div>
          <div className="stat-subtext">
            <span className="badge-tag-stat highlight">Dalam Pembinaan</span> Menunggu Lomba
          </div>
        </div>
      </div>
    </section>
  );
}

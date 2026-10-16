/**
 * SIPRESMA - Sistem Informasi Prestasi Siswa Madrasah
 * Core Application Logic, State Management, and Interactivity
 */

// Application State
const state = {
  currentRole: 'admin',
  activeTab: 'achieved',
  viewMode: 'grid', // 'grid' | 'table'
  records: [],
  filters: {
    search: '',
    category: 'all',
    level: 'all',
    year: 'all',
    mentorOnly: false
  },
  editingId: null,
  convertingId: null,
  theme: localStorage.getItem('sipresma_theme') || 'light'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadData();
  initEventListeners();
  updateRoleView();
  renderAll();
});

// ==========================================================================
// Theme & Persistence
// ==========================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.textContent = state.theme === 'dark' ? '☀️' : '🌓';
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('sipresma_theme', state.theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.textContent = state.theme === 'dark' ? '☀️' : '🌓';
  }
  // Re-render charts for dark/light color palette
  if (state.activeTab === 'analytics') {
    renderAnalyticsView();
  }
}

function loadData() {
  const localSaved = localStorage.getItem('sipresma_records');
  if (localSaved) {
    try {
      state.records = JSON.parse(localSaved);
    } catch (e) {
      console.error('Error parsing localStorage records:', e);
      state.records = [...INITIAL_ACHIEVEMENTS];
    }
  } else {
    state.records = [...INITIAL_ACHIEVEMENTS];
    saveData();
  }
}

function saveData() {
  localStorage.setItem('sipresma_records', JSON.stringify(state.records));
}

function resetToDefaultData() {
  if (confirm('Apakah Anda yakin ingin mengatur ulang data ke data percontohan awal?')) {
    state.records = [...INITIAL_ACHIEVEMENTS];
    saveData();
    renderAll();
    showToast('Data berhasil diatur ulang ke kondisi awal', 'info');
  }
}

// ==========================================================================
// Role Management & Permissions
// ==========================================================================
function setRole(roleKey) {
  if (!INITIAL_ROLES[roleKey]) return;
  state.currentRole = roleKey;
  updateRoleView();
  renderAll();
  showToast(`Beralih ke peran: ${INITIAL_ROLES[roleKey].name} (${INITIAL_ROLES[roleKey].roleName})`, 'info');
}

function updateRoleView() {
  const role = INITIAL_ROLES[state.currentRole];
  
  // Header dropdown
  const roleSelect = document.getElementById('roleSelector');
  if (roleSelect) roleSelect.value = state.currentRole;

  // Sidebar badge
  document.getElementById('sidebarAvatar').textContent = role.avatar;
  document.getElementById('sidebarUserName').textContent = role.name;
  document.getElementById('sidebarRoleTitle').textContent = role.roleName;

  // Role Banner
  const bannerIcon = document.getElementById('bannerRoleIcon');
  const bannerTitle = document.getElementById('bannerRoleTitle');
  const bannerDesc = document.getElementById('bannerRoleDesc');
  const bannerActions = document.getElementById('bannerRoleActions');

  bannerIcon.textContent = role.avatar;

  if (state.currentRole === 'admin') {
    bannerTitle.textContent = 'Akses Penuh: Administrator Kesiswaan';
    bannerDesc.textContent = 'Kelola data master prestasi akademik & non-akademik, validasi sertifikat, backup database, dan monitor agenda lomba.';
    bannerActions.innerHTML = `
      <button class="btn btn-sm btn-secondary" onclick="resetToDefaultData()">🔄 Reset Data Contoh</button>
      <button class="btn btn-sm btn-primary" onclick="openAddModal('achieved')">➕ Tambah Prestasi</button>
    `;
    document.getElementById('btnOpenAddModal').style.display = 'inline-flex';
  } else if (state.currentRole === 'kepala') {
    bannerTitle.textContent = 'Mode Eksekutif: Kepala Madrasah';
    bannerDesc.textContent = 'Pantau perkembangan prestasi santri madrasah, rekapitulasi capaian tingkat nasional/internasional, dan sahkan laporan resmi.';
    bannerActions.innerHTML = `
      <button class="btn btn-sm btn-gold" onclick="openPrintModal()">🖨️ Cetak Rekap Resmi</button>
      <button class="btn btn-sm btn-secondary" onclick="switchTab('analytics')">📊 Buka Analitik</button>
    `;
    document.getElementById('btnOpenAddModal').style.display = 'none';
  } else if (state.currentRole === 'guru') {
    bannerTitle.textContent = `Akses Pembimbing: ${role.name}`;
    bannerDesc.textContent = 'Daftarkan lomba yang akan datang, pantau jadwal persiapan, dan laporkan perolehan juara siswa bimbingan.';
    bannerActions.innerHTML = `
      <button class="btn btn-sm btn-primary" onclick="openAddModal('upcoming')">📅 Daftarkan Lomba Mendatang</button>
      <button class="btn btn-sm ${state.filters.mentorOnly ? 'btn-gold' : 'btn-secondary'}" onclick="toggleMentorOnlyFilter()">
        ${state.filters.mentorOnly ? '✓ Menampilkan Bimbingan Saya' : '🔍 Khusus Siswa Bimbingan Saya'}
      </button>
    `;
    document.getElementById('btnOpenAddModal').style.display = 'inline-flex';
  }
}

function toggleMentorOnlyFilter() {
  state.filters.mentorOnly = !state.filters.mentorOnly;
  updateRoleView();
  renderAll();
  if (state.filters.mentorOnly) {
    showToast('Memfilter prestasi siswa yang dibimbing Ustadzah Siti Rohmah', 'info');
  } else {
    showToast('Menampilkan seluruh data prestasi madrasah', 'info');
  }
}

// ==========================================================================
// Tab & View Switching
// ==========================================================================
function switchTab(tabName) {
  state.activeTab = tabName;

  // Update Navigation Items
  document.querySelectorAll('.nav-item[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-btn[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });

  // Page Heading
  const heading = document.getElementById('pageMainHeading');
  const filterRow = document.getElementById('filterBarRow');

  if (tabName === 'achieved') {
    heading.textContent = '🏆 Rekapitulasi Prestasi yang Sudah Diraih';
    filterRow.style.display = 'flex';
    document.getElementById('viewAchievedSection').style.display = 'block';
    document.getElementById('viewUpcomingSection').style.display = 'none';
    document.getElementById('viewAnalyticsSection').style.display = 'none';
  } else if (tabName === 'upcoming') {
    heading.textContent = '📅 Agenda & Lomba yang Akan Datang';
    filterRow.style.display = 'flex';
    document.getElementById('viewAchievedSection').style.display = 'none';
    document.getElementById('viewUpcomingSection').style.display = 'block';
    document.getElementById('viewAnalyticsSection').style.display = 'none';
  } else if (tabName === 'analytics') {
    heading.textContent = '📊 Rekapitulasi & Analisis Eksekutif Prestasi';
    filterRow.style.display = 'none';
    document.getElementById('viewAchievedSection').style.display = 'none';
    document.getElementById('viewUpcomingSection').style.display = 'none';
    document.getElementById('viewAnalyticsSection').style.display = 'flex';
    renderAnalyticsView();
  }

  renderAll();
}

function setViewMode(mode) {
  state.viewMode = mode;
  document.getElementById('viewGridBtn').classList.toggle('active', mode === 'grid');
  document.getElementById('viewTableBtn').classList.toggle('active', mode === 'table');

  if (state.activeTab === 'achieved') {
    document.getElementById('achievedGridContainer').style.display = mode === 'grid' ? 'grid' : 'none';
    document.getElementById('achievedTableContainer').style.display = mode === 'table' ? 'block' : 'none';
  } else if (state.activeTab === 'upcoming') {
    document.getElementById('upcomingGridContainer').style.display = mode === 'grid' ? 'grid' : 'none';
    document.getElementById('upcomingTableContainer').style.display = mode === 'table' ? 'block' : 'none';
  }
}

// ==========================================================================
// Data Filtering & Rendering
// ==========================================================================
function getFilteredRecords(type) {
  return state.records.filter(item => {
    // Check type (achieved / upcoming)
    if (item.type !== type) return false;

    // Search query
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      const match = (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.studentName && item.studentName.toLowerCase().includes(q)) ||
        (item.studentNisn && item.studentNisn.toLowerCase().includes(q)) ||
        (item.mentorName && item.mentorName.toLowerCase().includes(q)) ||
        (item.organizer && item.organizer.toLowerCase().includes(q)) ||
        (item.field && item.field.toLowerCase().includes(q))
      );
      if (!match) return false;
    }

    // Category filter
    if (state.filters.category !== 'all' && item.category !== state.filters.category) {
      return false;
    }

    // Level filter
    if (state.filters.level !== 'all' && item.level !== state.filters.level) {
      return false;
    }

    // Year filter
    if (state.filters.year !== 'all' && item.academicYear !== state.filters.year) {
      return false;
    }

    // Mentor Only Filter (Guru Pembimbing)
    if (state.filters.mentorOnly) {
      const mentorName = INITIAL_ROLES['guru'].name;
      if (!item.mentorName || !item.mentorName.includes('Siti Rohmah')) {
        return false;
      }
    }

    return true;
  });
}

function renderAll() {
  updateMetrics();
  renderAchieved();
  renderUpcoming();
}

function updateMetrics() {
  const achievedList = state.records.filter(r => r.type === 'achieved');
  const upcomingList = state.records.filter(r => r.type === 'upcoming');

  const totalAchieved = achievedList.length;
  const goldMedals = achievedList.filter(r => 
    r.rank && (r.rank.toLowerCase().includes('emas') || r.rank.toLowerCase().includes('juara 1') || r.rank.toLowerCase().includes('gold'))
  ).length;

  const nationalAndAbove = achievedList.filter(r => 
    r.level === 'Nasional' || r.level === 'Internasional'
  ).length;

  const totalUpcoming = upcomingList.length;

  // Counter Elements
  document.getElementById('statTotalAchieved').textContent = totalAchieved;
  document.getElementById('statGoldMedals').textContent = goldMedals;
  document.getElementById('statNationalLevel').textContent = nationalAndAbove;
  document.getElementById('statUpcomingEvents').textContent = totalUpcoming;

  // Badges in Nav & Tabs
  document.getElementById('badgeAchievedCount').textContent = totalAchieved;
  document.getElementById('tabAchievedCount').textContent = totalAchieved;
  document.getElementById('badgeUpcomingCount').textContent = totalUpcoming;
  document.getElementById('tabUpcomingCount').textContent = totalUpcoming;

  const ratio = totalAchieved > 0 ? Math.round((nationalAndAbove / totalAchieved) * 100) : 0;
  document.getElementById('statLevelRatio').textContent = `${ratio}% dari Total Prestasi`;
}

// --------------------------------------------------------------------------
// Render Achieved Records
// --------------------------------------------------------------------------
function renderAchieved() {
  const items = getFilteredRecords('achieved');
  const gridContainer = document.getElementById('achievedGridContainer');
  const tableBody = document.getElementById('achievedTableBody');

  if (items.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h4>Belum Ada Data Prestasi yang Sesuai</h4>
        <p>Coba ubah kata kunci pencarian atau sesuaikan filter kategori dan tingkat kejuaraan.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Reset Filter</button>
      </div>
    `;
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding: 40px; color: var(--text-muted);">
          Tidak ditemukan data prestasi yang sesuai dengan kriteria filter saat ini.
        </td>
      </tr>
    `;
    return;
  }

  // Render Grid Cards
  gridContainer.innerHTML = items.map(item => {
    let stripeClass = 'stripe-emerald';
    let rankIcon = '🏅';
    const rankLower = (item.rank || '').toLowerCase();

    if (rankLower.includes('emas') || rankLower.includes('juara 1') || rankLower.includes('gold')) {
      stripeClass = 'stripe-gold';
      rankIcon = '🥇';
    } else if (rankLower.includes('perak') || rankLower.includes('juara 2') || rankLower.includes('silver')) {
      stripeClass = 'stripe-silver';
      rankIcon = '🥈';
    } else if (rankLower.includes('perunggu') || rankLower.includes('juara 3') || rankLower.includes('bronze')) {
      stripeClass = 'stripe-bronze';
      rankIcon = '🥉';
    }

    const levelClass = getLevelBadgeClass(item.level);
    const categoryClass = item.category === 'Akademik' ? 'category-akademik' : 'category-non-akademik';

    const canEdit = state.currentRole === 'admin' || state.currentRole === 'guru';
    const canDelete = state.currentRole === 'admin';

    return `
      <div class="prestasi-card" data-id="${item.id}">
        <div class="card-top-stripe ${stripeClass}"></div>
        <div class="card-header-main">
          <span class="category-badge-pill ${categoryClass}">
            ${item.category === 'Akademik' ? '📘' : '🎨'} ${item.field || item.category}
          </span>
          <span class="level-badge ${levelClass}">${item.level}</span>
        </div>

        <div class="card-body-content">
          <h3 class="prestasi-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          
          <div class="rank-highlight-banner">
            <span class="rank-icon-big">${rankIcon}</span>
            <div>
              <div class="rank-text-bold">${escapeHtml(item.rank || 'Penghargaan')}</div>
              <div class="rank-organizer">${escapeHtml(item.organizer || 'Kemenag RI')}</div>
            </div>
          </div>

          <div class="prestasi-meta-list">
            <div class="meta-row">
              <span class="meta-label">👤 Siswa</span>
              <span class="meta-value">${escapeHtml(item.studentName)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">🏫 Kelas / NISN</span>
              <span class="meta-value">${escapeHtml(item.studentClass || '-')}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">👨‍🏫 Pembimbing</span>
              <span class="meta-value">${escapeHtml(item.mentorName || '-')}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">📅 Tanggal</span>
              <span class="meta-value">${formatIndonesianDate(item.eventDate)}</span>
            </div>
          </div>
        </div>

        <div class="card-footer-actions">
          <button class="btn btn-sm btn-outline-primary" onclick="openCertificateModal('${item.id}')">
            <span>📜</span> Sertifikat
          </button>
          <div class="action-btn-group">
            ${canEdit ? `<button class="btn btn-sm btn-secondary" onclick="openEditModal('${item.id}')" title="Edit Data">✏️</button>` : ''}
            ${canDelete ? `<button class="btn btn-sm btn-danger-outline" onclick="deleteRecord('${item.id}')" title="Hapus Data">🗑️</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render Table Rows
  tableBody.innerHTML = items.map((item, index) => {
    const levelClass = getLevelBadgeClass(item.level);
    const categoryClass = item.category === 'Akademik' ? 'category-akademik' : 'category-non-akademik';
    const canEdit = state.currentRole === 'admin' || state.currentRole === 'guru';
    const canDelete = state.currentRole === 'admin';

    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-muted);">${index + 1}</td>
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(item.studentName)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(item.studentClass || '-')}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main); max-width: 280px;">${escapeHtml(item.title)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(item.organizer || '')}</div>
        </td>
        <td>
          <span class="category-badge-pill ${categoryClass}" style="font-size: 0.68rem;">
            ${item.category}
          </span>
        </td>
        <td>
          <span class="level-badge ${levelClass}" style="font-size: 0.68rem;">${item.level}</span>
        </td>
        <td style="font-weight: 700; color: var(--gold-700);">${escapeHtml(item.rank || '-')}</td>
        <td style="font-size: 0.8rem;">${escapeHtml(item.mentorName || '-')}</td>
        <td style="white-space: nowrap; font-size: 0.78rem;">${formatIndonesianDate(item.eventDate)}</td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-sm btn-secondary" onclick="openCertificateModal('${item.id}')" title="Lihat Sertifikat">📜</button>
            ${canEdit ? `<button class="btn btn-sm btn-secondary" onclick="openEditModal('${item.id}')" title="Edit">✏️</button>` : ''}
            ${canDelete ? `<button class="btn btn-sm btn-danger-outline" onclick="deleteRecord('${item.id}')" title="Hapus">🗑️</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// Render Upcoming Competitions
// --------------------------------------------------------------------------
function renderUpcoming() {
  const items = getFilteredRecords('upcoming');
  const gridContainer = document.getElementById('upcomingGridContainer');
  const tableBody = document.getElementById('upcomingTableBody');

  if (items.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">📅</div>
        <h4>Tidak Ada Agenda Lomba Mendatang</h4>
        <p>Belum ada agenda lomba mendatang yang tercatat pada filter saat ini. Guru pembimbing atau admin dapat mendaftarkan agenda lomba baru.</p>
        <button class="btn btn-primary" onclick="openAddModal('upcoming')">➕ Daftarkan Lomba Baru</button>
      </div>
    `;
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding: 40px; color: var(--text-muted);">
          Tidak ada agenda lomba yang sesuai dengan kriteria pencarian.
        </td>
      </tr>
    `;
    return;
  }

  // Render Grid Cards
  gridContainer.innerHTML = items.map(item => {
    const levelClass = getLevelBadgeClass(item.level);
    const categoryClass = item.category === 'Akademik' ? 'category-akademik' : 'category-non-akademik';

    const countdown = calculateCountdown(item.competitionDate);
    const progress = item.preparationProgress || 70;

    const canEdit = state.currentRole === 'admin' || state.currentRole === 'guru';
    const canDelete = state.currentRole === 'admin';

    return `
      <div class="prestasi-card" data-id="${item.id}">
        <div class="card-top-stripe stripe-upcoming"></div>
        <div class="card-header-main">
          <span class="category-badge-pill ${categoryClass}">
            ${item.category === 'Akademik' ? '📘' : '🎨'} ${item.field || item.category}
          </span>
          <span class="level-badge ${levelClass}">${item.level}</span>
        </div>

        <div class="card-body-content">
          <h3 class="prestasi-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          
          <div class="upcoming-status-box">
            <div class="upcoming-countdown">
              <span class="countdown-badge ${countdown.isUrgent ? 'urgent' : ''}">
                ⏳ ${countdown.label}
              </span>
              <span class="competition-date-text">
                📅 ${formatIndonesianDate(item.competitionDate)}
              </span>
            </div>

            <div class="progress-header">
              <span>${escapeHtml(item.preparationStage || 'Tahap Persiapan')}</span>
              <span>${progress}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${progress}%;"></div>
            </div>
          </div>

          <div class="prestasi-meta-list">
            <div class="meta-row">
              <span class="meta-label">🎯 Target</span>
              <span class="meta-value" style="color: var(--gold-700);">${escapeHtml(item.targetRank || 'Medali Emas')}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">👤 Delegasi Siswa</span>
              <span class="meta-value">${escapeHtml(item.studentName)}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">🏫 Kelas</span>
              <span class="meta-value">${escapeHtml(item.studentClass || '-')}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">👨‍🏫 Pembimbing</span>
              <span class="meta-value">${escapeHtml(item.mentorName || '-')}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">📍 Lokasi</span>
              <span class="meta-value">${escapeHtml(item.location || item.organizer || '-')}</span>
            </div>
          </div>
        </div>

        <div class="card-footer-actions">
          <button class="btn btn-sm btn-gold" onclick="openConvertModal('${item.id}')" title="Lomba selesai? Catat juara yang diraih siswa">
            <span>🎉</span> Selesaikan & Catat Juara
          </button>
          <div class="action-btn-group">
            ${canEdit ? `<button class="btn btn-sm btn-secondary" onclick="openEditModal('${item.id}')" title="Edit Jadwal">✏️</button>` : ''}
            ${canDelete ? `<button class="btn btn-sm btn-danger-outline" onclick="deleteRecord('${item.id}')" title="Hapus Agenda">🗑️</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Render Table Rows
  tableBody.innerHTML = items.map((item, index) => {
    const levelClass = getLevelBadgeClass(item.level);
    const categoryClass = item.category === 'Akademik' ? 'category-akademik' : 'category-non-akademik';
    const countdown = calculateCountdown(item.competitionDate);
    const canEdit = state.currentRole === 'admin' || state.currentRole === 'guru';
    const canDelete = state.currentRole === 'admin';

    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-muted);">${index + 1}</td>
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${escapeHtml(item.studentName)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(item.studentClass || '-')}</div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main); max-width: 280px;">${escapeHtml(item.title)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(item.location || item.organizer || '')}</div>
        </td>
        <td>
          <span class="category-badge-pill ${categoryClass}" style="font-size: 0.68rem;">${item.category}</span>
        </td>
        <td>
          <span class="level-badge ${levelClass}" style="font-size: 0.68rem;">${item.level}</span>
        </td>
        <td style="font-weight: 700; color: var(--gold-700);">${escapeHtml(item.targetRank || '-')}</td>
        <td style="white-space: nowrap;">
          <div style="font-size: 0.8rem; font-weight: 600;">${formatIndonesianDate(item.competitionDate)}</div>
          <span class="countdown-badge ${countdown.isUrgent ? 'urgent' : ''}" style="font-size: 0.68rem; margin-top: 3px;">
            ${countdown.label}
          </span>
        </td>
        <td>
          <span style="font-size: 0.78rem; font-weight: 600; color: var(--accent-blue);">${escapeHtml(item.preparationStage || 'Persiapan')}</span>
          <div style="font-size: 0.72rem; color: var(--text-muted);">Progres ${item.preparationProgress || 70}%</div>
        </td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-sm btn-gold" onclick="openConvertModal('${item.id}')" title="Catat Juara">🎉 Selesai</button>
            ${canEdit ? `<button class="btn btn-sm btn-secondary" onclick="openEditModal('${item.id}')" title="Edit">✏️</button>` : ''}
            ${canDelete ? `<button class="btn btn-sm btn-danger-outline" onclick="deleteRecord('${item.id}')" title="Hapus">🗑️</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// --------------------------------------------------------------------------
// Render Executive Analytics View (Kepala Madrasah)
// --------------------------------------------------------------------------
function renderAnalyticsView() {
  const achievedList = state.records.filter(r => r.type === 'achieved');
  const upcomingList = state.records.filter(r => r.type === 'upcoming');

  // 1. Level Distribution Donut Chart
  renderLevelDonutChart(achievedList);

  // 2. Monthly Trend Bar Chart
  renderMonthlyBarChart(achievedList);

  // 3. Matrix Table
  renderMatrixSummary(achievedList, upcomingList);
}

function renderLevelDonutChart(achievedList) {
  const canvas = document.getElementById('levelDonutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // High DPI scaling
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

  const counts = levels.map(lvl => achievedList.filter(item => item.level === lvl).length);
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

  // Center Text
  const isDark = state.theme === 'dark';
  ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
  ctx.font = 'bold 26px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total.toString(), centerX, centerY - 6);

  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.fillText('TOTAL PRESTASI', centerX, centerY + 16);

  // Render Legend
  const legendContainer = document.getElementById('levelChartLegend');
  legendContainer.innerHTML = levels.map((lvl, i) => {
    const percentage = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
    return `
      <div class="legend-item">
        <span class="legend-color-dot" style="background-color: ${colors[i]};"></span>
        <span>${lvl}: <strong>${counts[i]}</strong> (${percentage}%)</span>
      </div>
    `;
  }).join('');
}

function renderMonthlyBarChart(achievedList) {
  const canvas = document.getElementById('monthlyBarChart');
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

  // Group achievements by month (Jan - Dec)
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthCounts = new Array(12).fill(0);

  achievedList.forEach(item => {
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

  const isDark = state.theme === 'dark';

  // Draw Horizontal Grid Lines
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

    // Gradient Fill for Bars
    const gradient = ctx.createLinearGradient(0, y, 0, chartBottom);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, '#047857');

    ctx.fillStyle = val > 0 ? gradient : (isDark ? '#1e293b' : '#e2e8f0');
    
    // Draw rounded rect with fallback
    ctx.beginPath();
    const radius = 4;
    if (ctx.roundRect) {
      ctx.roundRect(x, val > 0 ? y : chartBottom - 2, barWidth, val > 0 ? barH : 2, [radius, radius, 0, 0]);
    } else {
      ctx.rect(x, val > 0 ? y : chartBottom - 2, barWidth, val > 0 ? barH : 2);
    }
    ctx.fill();

    // Value text above bar
    if (val > 0) {
      ctx.fillStyle = isDark ? '#34d399' : '#047857';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), x + barWidth / 2, y - 6);
    }

    // Month label
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '10px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(monthLabels[idx], x + barWidth / 2, chartBottom + 18);
  });

  const legendContainer = document.getElementById('monthlyChartLegend');
  legendContainer.innerHTML = `
    <div class="legend-item">
      <span class="legend-color-dot" style="background-color: #10b981;"></span>
      <span>Total Kejuaraan Diraih per Bulan Tahun 2026</span>
    </div>
  `;
}

function renderMatrixSummary(achievedList, upcomingList) {
  const tableBody = document.getElementById('matrixTableBody');
  if (!tableBody) return;

  const fields = MASTER_FIELDS;

  tableBody.innerHTML = fields.map(field => {
    const fieldAchieved = achievedList.filter(item => item.field === field);
    const fieldUpcoming = upcomingList.filter(item => item.field === field);

    const intl = fieldAchieved.filter(item => item.level === 'Internasional').length;
    const nas = fieldAchieved.filter(item => item.level === 'Nasional').length;
    const prov = fieldAchieved.filter(item => item.level === 'Provinsi').length;
    const kab = fieldAchieved.filter(item => item.level === 'Kabupaten/Kota').length;
    const total = fieldAchieved.length;
    const upcomingCount = fieldUpcoming.length;

    // Detect general category
    const isAcademic = ['KSM Sains', 'Riset & Karya Ilmiah (MYRES)', 'Robotika & AI', 'Bahasa & Literasi'].includes(field);

    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-main);">${escapeHtml(field)}</td>
        <td>
          <span class="category-badge-pill ${isAcademic ? 'category-akademik' : 'category-non-akademik'}" style="font-size: 0.68rem;">
            ${isAcademic ? 'Akademik' : 'Non-Akademik'}
          </span>
        </td>
        <td style="text-align: center; font-weight: ${intl > 0 ? '700' : 'normal'}; color: ${intl > 0 ? '#7c3aed' : 'inherit'};">${intl}</td>
        <td style="text-align: center; font-weight: ${nas > 0 ? '700' : 'normal'}; color: ${nas > 0 ? '#d97706' : 'inherit'};">${nas}</td>
        <td style="text-align: center; font-weight: ${prov > 0 ? '700' : 'normal'}; color: ${prov > 0 ? '#059669' : 'inherit'};">${prov}</td>
        <td style="text-align: center; font-weight: ${kab > 0 ? '700' : 'normal'}; color: ${kab > 0 ? '#0284c7' : 'inherit'};">${kab}</td>
        <td style="text-align: center; font-weight: 800; font-size: 1rem; color: var(--primary-700);">${total}</td>
        <td style="text-align: center;">
          <span class="badge-tag-stat ${upcomingCount > 0 ? 'highlight' : ''}">${upcomingCount} Agenda</span>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================================================
// Modal Handlers & CRUD Logic
// ==========================================================================
function openAddModal(defaultType = 'achieved') {
  state.editingId = null;
  document.getElementById('formModalTitle').textContent = defaultType === 'achieved' ? '➕ Tambah Prestasi yang Sudah Diraih' : '📅 Daftarkan Lomba yang Akan Datang';
  document.getElementById('prestasiForm').reset();

  const radio = defaultType === 'achieved' ? document.getElementById('radioAchieved') : document.getElementById('radioUpcoming');
  if (radio) {
    radio.checked = true;
    toggleFormFieldsByType(defaultType);
  }

  // Pre-fill today's date
  document.getElementById('inputDate').value = new Date().toISOString().split('T')[0];

  // If role is guru pembimbing, pre-fill mentor name
  if (state.currentRole === 'guru') {
    document.getElementById('inputMentorName').value = INITIAL_ROLES['guru'].name;
  }

  document.getElementById('addEditModal').classList.add('active');
}

function openEditModal(id) {
  const record = state.records.find(r => r.id === id);
  if (!record) return;

  state.editingId = id;
  document.getElementById('formModalTitle').textContent = '✏️ Edit Data Prestasi / Lomba';

  const type = record.type || 'achieved';
  if (type === 'achieved') {
    document.getElementById('radioAchieved').checked = true;
  } else {
    document.getElementById('radioUpcoming').checked = true;
  }
  toggleFormFieldsByType(type);

  document.getElementById('inputTitle').value = record.title || '';
  document.getElementById('inputCategory').value = record.category || 'Akademik';
  document.getElementById('inputField').value = record.field || 'KSM Sains';
  document.getElementById('inputLevel').value = record.level || 'Nasional';
  document.getElementById('inputRank').value = record.rank || '';
  document.getElementById('inputTargetRank').value = record.targetRank || '';
  document.getElementById('inputDate').value = record.eventDate || record.competitionDate || '';
  document.getElementById('inputYear').value = record.academicYear || '2026/2027';
  document.getElementById('inputOrganizer').value = record.organizer || '';
  document.getElementById('inputStudentName').value = record.studentName || '';
  document.getElementById('inputStudentClass').value = record.studentClass || '';
  document.getElementById('inputMentorName').value = record.mentorName || '';
  document.getElementById('inputStage').value = record.preparationStage || 'Pembinaan Intensif';
  document.getElementById('inputNotes').value = record.notes || '';

  document.getElementById('addEditModal').classList.add('active');
}

function toggleFormFieldsByType(type) {
  const isAchieved = type === 'achieved';
  document.getElementById('fieldRankGroup').style.display = isAchieved ? 'flex' : 'none';
  document.getElementById('fieldTargetRankGroup').style.display = isAchieved ? 'none' : 'flex';
  document.getElementById('fieldUpcomingStageGroup').style.display = isAchieved ? 'none' : 'flex';
  document.getElementById('labelDate').textContent = isAchieved ? 'Tanggal Penghargaan *' : 'Tanggal Pelaksanaan Lomba *';
}

function handleFormSubmit(e) {
  e.preventDefault();

  const type = document.querySelector('input[name="entryType"]:checked').value;
  const title = document.getElementById('inputTitle').value.trim();
  const category = document.getElementById('inputCategory').value;
  const field = document.getElementById('inputField').value;
  const level = document.getElementById('inputLevel').value;
  const dateVal = document.getElementById('inputDate').value;
  const academicYear = document.getElementById('inputYear').value;
  const organizer = document.getElementById('inputOrganizer').value.trim();
  const studentName = document.getElementById('inputStudentName').value.trim();
  const studentClass = document.getElementById('inputStudentClass').value.trim();
  const mentorName = document.getElementById('inputMentorName').value.trim();
  const notes = document.getElementById('inputNotes').value.trim();

  if (state.editingId) {
    // Update existing record
    const index = state.records.findIndex(r => r.id === state.editingId);
    if (index !== -1) {
      state.records[index] = {
        ...state.records[index],
        type,
        title,
        category,
        field,
        level,
        academicYear,
        organizer,
        studentName,
        studentClass,
        mentorName,
        notes,
        ...(type === 'achieved' ? {
          rank: document.getElementById('inputRank').value.trim() || 'Juara',
          eventDate: dateVal
        } : {
          targetRank: document.getElementById('inputTargetRank').value.trim() || 'Target Juara',
          competitionDate: dateVal,
          preparationStage: document.getElementById('inputStage').value
        })
      };
      showToast('Data berhasil diperbarui', 'success');
    }
  } else {
    // Create new record
    const newId = (type === 'achieved' ? 'ACH-' : 'UPC-') + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900);
    const newRecord = {
      id: newId,
      type,
      title,
      category,
      field,
      level,
      academicYear,
      organizer: organizer || 'Kementerian Agama',
      studentName,
      studentClass,
      mentorName,
      statusVerification: 'verified',
      notes,
      certificateFile: 'assets/certificate.jpg',
      ...(type === 'achieved' ? {
        rank: document.getElementById('inputRank').value.trim() || 'Juara 1',
        eventDate: dateVal
      } : {
        targetRank: document.getElementById('inputTargetRank').value.trim() || 'Target Medali Emas',
        competitionDate: dateVal,
        preparationStage: document.getElementById('inputStage').value,
        preparationProgress: 80,
        location: organizer || 'Pusat Kompetisi Madrasah'
      })
    };
    state.records.unshift(newRecord);
    showToast(`Data ${type === 'achieved' ? 'prestasi baru' : 'agenda lomba'} berhasil ditambahkan`, 'success');
  }

  saveData();
  closeModal('addEditModal');
  renderAll();
}

function deleteRecord(id) {
  const item = state.records.find(r => r.id === id);
  if (!item) return;

  if (confirm(`Apakah Anda yakin ingin menghapus "${item.title}"?`)) {
    state.records = state.records.filter(r => r.id !== id);
    saveData();
    renderAll();
    showToast('Data berhasil dihapus dari sistem', 'info');
  }
}

// --------------------------------------------------------------------------
// Quick Convert Upcoming -> Achieved
// --------------------------------------------------------------------------
function openConvertModal(id) {
  const item = state.records.find(r => r.id === id);
  if (!item) return;

  state.convertingId = id;
  document.getElementById('convertTitle').value = item.title;
  document.getElementById('convertStudent').value = `${item.studentName} (${item.studentClass || '-'})`;
  document.getElementById('convertRank').value = item.targetRank ? item.targetRank.replace('Target: ', '') : 'Juara 1 (Medali Emas)';
  document.getElementById('convertDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('convertNotes').value = item.notes || '';

  document.getElementById('convertModal').classList.add('active');
}

function handleConvertSubmit(e) {
  e.preventDefault();
  const id = state.convertingId;
  const item = state.records.find(r => r.id === id);
  if (!item) return;

  const rank = document.getElementById('convertRank').value.trim();
  const dateVal = document.getElementById('convertDate').value;
  const notes = document.getElementById('convertNotes').value.trim();

  // Convert properties to achieved
  item.type = 'achieved';
  item.rank = rank;
  item.eventDate = dateVal;
  item.notes = notes;
  item.certificateFile = 'assets/certificate.jpg';
  delete item.competitionDate;
  delete item.preparationStage;
  delete item.preparationProgress;

  saveData();
  closeModal('convertModal');
  switchTab('achieved');
  showToast(`Selamat! "${item.title}" berhasil dicatat sebagai Prestasi Diraih`, 'success');
}

// --------------------------------------------------------------------------
// Certificate Viewer Modal
// --------------------------------------------------------------------------
function openCertificateModal(id) {
  const item = state.records.find(r => r.id === id);
  if (!item) return;

  document.getElementById('certStudentName').textContent = item.studentName;
  document.getElementById('certAchievementInfo').textContent = `${item.rank} - ${item.title} (${item.level})`;
  document.getElementById('certModal').classList.add('active');
}

// --------------------------------------------------------------------------
// Official Print Rekapitulasi (Kop Surat Dinas)
// --------------------------------------------------------------------------
function openPrintModal() {
  const achievedList = state.records.filter(r => r.type === 'achieved');
  const printTableRows = document.getElementById('printTableRows');
  
  // Format current date in Indonesian
  const todayStr = formatIndonesianDate(new Date().toISOString().split('T')[0]);
  document.getElementById('printCurrentDate').textContent = todayStr;

  printTableRows.innerHTML = achievedList.map((item, index) => `
    <tr>
      <td style="text-align: center;">${index + 1}</td>
      <td><strong>${escapeHtml(item.studentName)}</strong></td>
      <td style="text-align: center;">${escapeHtml(item.studentClass || '-')}</td>
      <td>${escapeHtml(item.title)}</td>
      <td style="text-align: center;">${escapeHtml(item.category)}</td>
      <td style="text-align: center;">${escapeHtml(item.level)}</td>
      <td style="text-align: center; font-weight: bold;">${escapeHtml(item.rank || '-')}</td>
      <td>${escapeHtml(item.mentorName || '-')}</td>
    </tr>
  `).join('');

  document.getElementById('printModal').classList.add('active');
}

// --------------------------------------------------------------------------
// Export Data to CSV
// --------------------------------------------------------------------------
function exportToCSV() {
  const achievedList = state.records.filter(r => r.type === 'achieved');
  if (achievedList.length === 0) {
    showToast('Tidak ada data prestasi untuk diekspor', 'info');
    return;
  }

  const headers = ['No', 'ID', 'Nama Siswa', 'Kelas', 'Nama Kejuaraan', 'Kategori', 'Bidang', 'Tingkat', 'Peringkat', 'Guru Pembimbing', 'Tanggal', 'Tahun Ajaran', 'Penyelenggara'];
  
  const rows = achievedList.map((item, index) => [
    index + 1,
    `"${item.id}"`,
    `"${item.studentName}"`,
    `"${item.studentClass || '-'}"`,
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.category}"`,
    `"${item.field || '-'}"`,
    `"${item.level}"`,
    `"${item.rank || '-'}"`,
    `"${item.mentorName || '-'}"`,
    `"${item.eventDate || '-'}"`,
    `"${item.academicYear || '-'}"`,
    `"${(item.organizer || '-').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekapitulasi_Prestasi_Madrasah_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('File CSV Rekapitulasi Prestasi berhasil diunduh', 'success');
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function initEventListeners() {
  // Theme Toggle
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);

  // Quick Help Modal
  document.getElementById('quickHelpBtn').addEventListener('click', () => {
    document.getElementById('guideModal').classList.add('active');
  });
  document.getElementById('navHelpGuide').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('guideModal').classList.add('active');
  });

  // Mobile Menu Burger
  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('appSidebar').classList.toggle('open');
  });

  // Role Selector Dropdown
  document.getElementById('roleSelector').addEventListener('change', (e) => {
    setRole(e.target.value);
  });

  // Navigation Links
  document.querySelectorAll('.sidebar-nav .nav-item[data-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(el.dataset.tab);
      document.getElementById('appSidebar').classList.remove('open');
    });
  });

  // Tabs Buttons
  document.querySelectorAll('.tab-btn[data-tab]').forEach(el => {
    el.addEventListener('click', () => {
      switchTab(el.dataset.tab);
    });
  });

  // View Switcher (Grid vs Table)
  document.getElementById('viewGridBtn').addEventListener('click', () => setViewMode('grid'));
  document.getElementById('viewTableBtn').addEventListener('click', () => setViewMode('table'));

  // Live Search & Filters
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderAchieved();
    renderUpcoming();
  });

  document.getElementById('filterCategory').addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    renderAchieved();
    renderUpcoming();
  });

  document.getElementById('filterLevel').addEventListener('change', (e) => {
    state.filters.level = e.target.value;
    renderAchieved();
    renderUpcoming();
  });

  document.getElementById('filterYear').addEventListener('change', (e) => {
    state.filters.year = e.target.value;
    renderAchieved();
    renderUpcoming();
  });

  // Add / Edit Modal
  document.getElementById('btnOpenAddModal').addEventListener('click', () => {
    openAddModal(state.activeTab === 'upcoming' ? 'upcoming' : 'achieved');
  });
  document.getElementById('closeAddModalBtn').addEventListener('click', () => closeModal('addEditModal'));
  document.getElementById('cancelAddModalBtn').addEventListener('click', () => closeModal('addEditModal'));
  document.getElementById('prestasiForm').addEventListener('submit', handleFormSubmit);

  // Radio button type switch in Form
  document.querySelectorAll('input[name="entryType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      toggleFormFieldsByType(e.target.value);
    });
  });

  // Quick Convert Modal
  document.getElementById('closeConvertModalBtn').addEventListener('click', () => closeModal('convertModal'));
  document.getElementById('cancelConvertBtn').addEventListener('click', () => closeModal('convertModal'));
  document.getElementById('convertForm').addEventListener('submit', handleConvertSubmit);

  // Certificate Modal
  document.getElementById('closeCertModalBtn').addEventListener('click', () => closeModal('certModal'));
  document.getElementById('closeCertBtnFooter').addEventListener('click', () => closeModal('certModal'));

  // Print Rekap Modal
  document.getElementById('navPrintRekap').addEventListener('click', (e) => {
    e.preventDefault();
    openPrintModal();
    document.getElementById('appSidebar').classList.remove('open');
  });
  document.getElementById('btnCetakRekapQuick').addEventListener('click', openPrintModal);
  document.getElementById('btnExecPrintOfficial').addEventListener('click', openPrintModal);
  document.getElementById('closePrintModalBtn').addEventListener('click', () => closeModal('printModal'));
  document.getElementById('closePrintModalFooterBtn').addEventListener('click', () => closeModal('printModal'));
  document.getElementById('btnExecuteBrowserPrint').addEventListener('click', () => {
    window.print();
  });

  // Export Data
  document.getElementById('navExportData').addEventListener('click', (e) => {
    e.preventDefault();
    exportToCSV();
    document.getElementById('appSidebar').classList.remove('open');
  });
  document.getElementById('btnExecExportCSV').addEventListener('click', exportToCSV);

  // Guide Modal Close
  document.getElementById('closeGuideModalBtn').addEventListener('click', () => closeModal('guideModal'));
  document.getElementById('closeGuideBtnFooter').addEventListener('click', () => closeModal('guideModal'));

  // Close modals on outside overlay click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function resetFilters() {
  state.filters = {
    search: '',
    category: 'all',
    level: 'all',
    year: 'all',
    mentorOnly: false
  };
  document.getElementById('searchInput').value = '';
  document.getElementById('filterCategory').value = 'all';
  document.getElementById('filterLevel').value = 'all';
  document.getElementById('filterYear').value = 'all';
  updateRoleView();
  renderAll();
}

// ==========================================================================
// Utilities & Helpers
// ==========================================================================
function getLevelBadgeClass(level) {
  switch (level) {
    case 'Internasional': return 'level-internasional';
    case 'Nasional': return 'level-nasional';
    case 'Provinsi': return 'level-provinsi';
    default: return 'level-kabupaten';
  }
}

function formatIndonesianDate(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  return `${day} ${months[monthIdx] || ''} ${year}`;
}

function calculateCountdown(dateStr) {
  if (!dateStr) return { label: 'Jadwal Ditentukan', isUrgent: false };
  
  // Current simulated base date: 2026-10-16
  const target = new Date(dateStr);
  const now = new Date('2026-10-16');

  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `Lewat ${Math.abs(diffDays)} Hari`, isUrgent: false };
  } else if (diffDays === 0) {
    return { label: 'Hari Ini!', isUrgent: true };
  } else if (diffDays <= 7) {
    return { label: `H-${diffDays} Hari Lagi`, isUrgent: true };
  } else {
    return { label: `H-${diffDays} Hari`, isUrgent: false };
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : 'ℹ️'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

import React, { useState, useEffect } from 'react';
import { INITIAL_ROLES, INITIAL_ACHIEVEMENTS } from './data/initialData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RoleBanner from './components/RoleBanner';
import StatCards from './components/StatCards';
import Controls from './components/Controls';
import AchievedList from './components/AchievedList';
import UpcomingList from './components/UpcomingList';
import AnalyticsView from './components/AnalyticsView';
import {
  AddEditModal,
  ConvertModal,
  CertificateModal,
  OfficialPrintModal,
  GuideModal,
  ToastNotification
} from './components/Modals';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sipresma_theme') || 'light';
  });

  // Records state
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('sipresma_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored records:', e);
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  // Role & Navigation
  const [roleKey, setRoleKey] = useState('admin');
  const [activeTab, setActiveTab] = useState('achieved');
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    level: 'all',
    year: 'all',
    mentorOnly: false
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [convertingItem, setConvertingItem] = useState(null);
  const [certificateItem, setCertificateItem] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sipresma_theme', theme);
  }, [theme]);

  // Sync records to localStorage
  useEffect(() => {
    localStorage.setItem('sipresma_records', JSON.stringify(records));
  }, [records]);

  const currentRole = INITIAL_ROLES[roleKey];

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleChangeRole = (newRoleKey) => {
    setRoleKey(newRoleKey);
    showToast(
      `Beralih ke peran: ${INITIAL_ROLES[newRoleKey].name} (${INITIAL_ROLES[newRoleKey].roleName})`,
      'info'
    );
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke data percontohan awal?')) {
      setRecords(INITIAL_ACHIEVEMENTS);
      showToast('Data berhasil diatur ulang ke kondisi awal', 'info');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      level: 'all',
      year: 'all',
      mentorOnly: false
    });
  };

  const handleToggleMentorFilter = () => {
    setFilters((prev) => {
      const nextVal = !prev.mentorOnly;
      if (nextVal) {
        showToast('Memfilter prestasi siswa bimbingan Ustadzah Siti Rohmah', 'info');
      } else {
        showToast('Menampilkan seluruh data prestasi madrasah', 'info');
      }
      return { ...prev, mentorOnly: nextVal };
    });
  };

  // Add / Edit submission
  const handleSaveRecord = (formData) => {
    if (editingItem) {
      setRecords((prev) =>
        prev.map((item) => {
          if (item.id === editingItem.id) {
            return {
              ...item,
              type: formData.entryType,
              title: formData.title,
              category: formData.category,
              field: formData.field,
              level: formData.level,
              academicYear: formData.year,
              organizer: formData.organizer,
              studentName: formData.studentName,
              studentClass: formData.studentClass,
              mentorName: formData.mentorName,
              notes: formData.notes,
              ...(formData.entryType === 'achieved'
                ? {
                    rank: formData.rank || 'Juara',
                    eventDate: formData.date
                  }
                : {
                    targetRank: formData.targetRank || 'Target Juara',
                    competitionDate: formData.date,
                    preparationStage: formData.stage
                  })
            };
          }
          return item;
        })
      );
      showToast('Data berhasil diperbarui', 'success');
    } else {
      const newId =
        (formData.entryType === 'achieved' ? 'ACH-' : 'UPC-') +
        new Date().getFullYear() +
        '-' +
        Math.floor(100 + Math.random() * 900);

      const newRecord = {
        id: newId,
        type: formData.entryType,
        title: formData.title,
        category: formData.category,
        field: formData.field,
        level: formData.level,
        academicYear: formData.year,
        organizer: formData.organizer || 'Kementerian Agama',
        studentName: formData.studentName,
        studentClass: formData.studentClass,
        mentorName: formData.mentorName,
        statusVerification: 'verified',
        notes: formData.notes,
        certificateFile: './assets/certificate.jpg',
        ...(formData.entryType === 'achieved'
          ? {
              rank: formData.rank || 'Juara 1',
              eventDate: formData.date
            }
          : {
              targetRank: formData.targetRank || 'Target Medali Emas',
              competitionDate: formData.date,
              preparationStage: formData.stage,
              preparationProgress: 80,
              location: formData.organizer || 'Pusat Kompetisi Madrasah'
            })
      };

      setRecords((prev) => [newRecord, ...prev]);
      showToast(
        `Data ${formData.entryType === 'achieved' ? 'prestasi baru' : 'agenda lomba'} berhasil ditambahkan`,
        'success'
      );
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteRecord = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      showToast('Data berhasil dihapus dari sistem', 'info');
    }
  };

  // Convert Upcoming to Achieved
  const handleConfirmConvert = (id, resultData) => {
    setRecords((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            type: 'achieved',
            rank: resultData.rank,
            eventDate: resultData.date,
            notes: resultData.notes,
            certificateFile: './assets/certificate.jpg'
          };
        }
        return item;
      })
    );
    setConvertingItem(null);
    setActiveTab('achieved');
    showToast('Selamat! Lomba berhasil dicatat sebagai Prestasi Diraih', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    const achievedList = records.filter((r) => r.type === 'achieved');
    if (achievedList.length === 0) {
      showToast('Tidak ada data prestasi untuk diekspor', 'info');
      return;
    }

    const headers = [
      'No', 'ID', 'Nama Siswa', 'Kelas', 'Nama Kejuaraan',
      'Kategori', 'Bidang', 'Tingkat', 'Peringkat',
      'Guru Pembimbing', 'Tanggal', 'Tahun Ajaran', 'Penyelenggara'
    ];

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

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rekapitulasi_Prestasi_Madrasah_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('File CSV Rekapitulasi Prestasi berhasil diunduh', 'success');
  };

  // Filter records
  const filteredAchieved = records.filter((item) => {
    if (item.type !== 'achieved') return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.studentName && item.studentName.toLowerCase().includes(q)) ||
        (item.studentNisn && item.studentNisn.toLowerCase().includes(q)) ||
        (item.mentorName && item.mentorName.toLowerCase().includes(q)) ||
        (item.organizer && item.organizer.toLowerCase().includes(q)) ||
        (item.field && item.field.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.level !== 'all' && item.level !== filters.level) return false;
    if (filters.year !== 'all' && item.academicYear !== filters.year) return false;
    if (filters.mentorOnly) {
      if (!item.mentorName || !item.mentorName.includes('Siti Rohmah')) return false;
    }
    return true;
  });

  const filteredUpcoming = records.filter((item) => {
    if (item.type !== 'upcoming') return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.studentName && item.studentName.toLowerCase().includes(q)) ||
        (item.studentNisn && item.studentNisn.toLowerCase().includes(q)) ||
        (item.mentorName && item.mentorName.toLowerCase().includes(q)) ||
        (item.organizer && item.organizer.toLowerCase().includes(q)) ||
        (item.field && item.field.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.level !== 'all' && item.level !== filters.level) return false;
    if (filters.year !== 'all' && item.academicYear !== filters.year) return false;
    if (filters.mentorOnly) {
      if (!item.mentorName || !item.mentorName.includes('Siti Rohmah')) return false;
    }
    return true;
  });

  const achievedCount = records.filter((r) => r.type === 'achieved').length;
  const upcomingCount = records.filter((r) => r.type === 'upcoming').length;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        achievedCount={achievedCount}
        upcomingCount={upcomingCount}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onExportCSV={handleExportCSV}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Area */}
      <main className="app-main">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          roleKey={roleKey}
          onChangeRole={handleChangeRole}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)}
        />

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Dynamic Role Banner */}
          <RoleBanner
            roleKey={roleKey}
            role={currentRole}
            onOpenAddModal={(type) => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            onResetData={handleResetData}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onSwitchTab={setActiveTab}
            mentorOnlyFilter={filters.mentorOnly}
            onToggleMentorFilter={handleToggleMentorFilter}
          />

          {/* 4 Stat Overview Cards */}
          <StatCards records={records} />

          {/* Controls Bar */}
          <Controls
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            achievedCount={achievedCount}
            upcomingCount={upcomingCount}
            filters={filters}
            onChangeFilter={handleFilterChange}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            canAdd={currentRole.permissions.canAdd}
            onOpenAddModal={(type) => {
              setEditingItem(null);
              setIsAddModalOpen(true);
            }}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
          />

          {/* Main Views */}
          {activeTab === 'achieved' && (
            <AchievedList
              items={filteredAchieved}
              viewMode={viewMode}
              onOpenCertificate={(item) => setCertificateItem(item)}
              onEdit={(item) => {
                setEditingItem(item);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeleteRecord}
              canEdit={currentRole.permissions.canEdit}
              canDelete={currentRole.permissions.canDelete}
              onResetFilters={handleResetFilters}
            />
          )}

          {activeTab === 'upcoming' && (
            <UpcomingList
              items={filteredUpcoming}
              viewMode={viewMode}
              onOpenConvertModal={(item) => setConvertingItem(item)}
              onEdit={(item) => {
                setEditingItem(item);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeleteRecord}
              canEdit={currentRole.permissions.canEdit}
              canDelete={currentRole.permissions.canDelete}
              onOpenAddModal={(type) => {
                setEditingItem(null);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              records={records}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onExportCSV={handleExportCSV}
              theme={theme}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddEditModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem}
        onSubmit={handleSaveRecord}
        currentRoleKey={roleKey}
      />

      <ConvertModal
        isOpen={Boolean(convertingItem)}
        onClose={() => setConvertingItem(null)}
        item={convertingItem}
        onConfirm={handleConfirmConvert}
      />

      <CertificateModal
        isOpen={Boolean(certificateItem)}
        onClose={() => setCertificateItem(null)}
        item={certificateItem}
      />

      <OfficialPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        records={records}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <ToastNotification toasts={toasts} />
    </div>
  );
}

import React, { useState, useEffect } from 'react';

// ==========================================================================
// 1. ADD / EDIT MODAL
// ==========================================================================
export function AddEditModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  currentRoleKey
}) {
  const [formData, setFormData] = useState({
    entryType: 'achieved',
    title: '',
    category: 'Akademik',
    field: 'KSM Sains',
    level: 'Nasional',
    rank: '',
    targetRank: '',
    date: new Date().toISOString().split('T')[0],
    year: '2026/2027',
    organizer: '',
    studentName: '',
    studentClass: '',
    mentorName: '',
    stage: 'Pembinaan Intensif',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        entryType: initialData.type || 'achieved',
        title: initialData.title || '',
        category: initialData.category || 'Akademik',
        field: initialData.field || 'KSM Sains',
        level: initialData.level || 'Nasional',
        rank: initialData.rank || '',
        targetRank: initialData.targetRank || '',
        date: initialData.eventDate || initialData.competitionDate || new Date().toISOString().split('T')[0],
        year: initialData.academicYear || '2026/2027',
        organizer: initialData.organizer || '',
        studentName: initialData.studentName || '',
        studentClass: initialData.studentClass || '',
        mentorName: initialData.mentorName || (currentRoleKey === 'guru' ? 'Ustadzah Siti Rohmah, M.Pd' : ''),
        stage: initialData.preparationStage || 'Pembinaan Intensif',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        entryType: 'achieved',
        title: '',
        category: 'Akademik',
        field: 'KSM Sains',
        level: 'Nasional',
        rank: '',
        targetRank: '',
        date: new Date().toISOString().split('T')[0],
        year: '2026/2027',
        organizer: '',
        studentName: '',
        studentClass: '',
        mentorName: currentRoleKey === 'guru' ? 'Ustadzah Siti Rohmah, M.Pd' : '',
        stage: 'Pembinaan Intensif',
        notes: ''
      });
    }
  }, [initialData, isOpen, currentRoleKey]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isAchieved = formData.entryType === 'achieved';

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            {initialData
              ? '✏️ Edit Data Prestasi / Lomba'
              : isAchieved
              ? '➕ Tambah Prestasi yang Sudah Diraih'
              : '📅 Daftarkan Lomba yang Akan Datang'}
          </h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup Modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Type Switch */}
              <div className="form-group full-width">
                <label className="form-label">
                  Tipe Entri Data <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <input
                      type="radio"
                      name="entryType"
                      value="achieved"
                      checked={formData.entryType === 'achieved'}
                      onChange={() => handleChange('entryType', 'achieved')}
                    />
                    🏆 Prestasi yang Sudah Diraih
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <input
                      type="radio"
                      name="entryType"
                      value="upcoming"
                      checked={formData.entryType === 'upcoming'}
                      onChange={() => handleChange('entryType', 'upcoming')}
                    />
                    📅 Lomba yang Akan Berlangsung
                  </label>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  Nama Kejuaraan / Kompetisi <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Juara 1 KSM Matematika Tingkat Nasional"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Kategori <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  <option value="Akademik">Akademik</option>
                  <option value="Non-Akademik">Non-Akademik</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Bidang Kompetisi <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.field}
                  onChange={(e) => handleChange('field', e.target.value)}
                  required
                >
                  <option value="KSM Sains">KSM Sains</option>
                  <option value="Riset & Karya Ilmiah (MYRES)">Riset & Karya Ilmiah (MYRES)</option>
                  <option value="Robotika & AI">Robotika & AI</option>
                  <option value="Bahasa & Literasi">Bahasa & Literasi</option>
                  <option value="Keagamaan & Tahfidz">Keagamaan & Tahfidz</option>
                  <option value="Seni Budaya & Kaligrafi">Seni Budaya & Kaligrafi</option>
                  <option value="Olahraga & Seni Bela Diri">Olahraga & Seni Bela Diri</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tingkat Kejuaraan <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.level}
                  onChange={(e) => handleChange('level', e.target.value)}
                  required
                >
                  <option value="Internasional">Internasional</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Kabupaten/Kota">Kabupaten/Kota</option>
                  <option value="Kecamatan">Kecamatan</option>
                </select>
              </div>

              {isAchieved ? (
                <div className="form-group">
                  <label className="form-label">
                    Peringkat / Capaian <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Juara 1 (Medali Emas)"
                    value={formData.rank}
                    onChange={(e) => handleChange('rank', e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">
                    Target Capaian <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Target Medali Emas"
                    value={formData.targetRank}
                    onChange={(e) => handleChange('targetRank', e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  {isAchieved ? 'Tanggal Penghargaan' : 'Tanggal Pelaksanaan Lomba'}{' '}
                  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tahun Ajaran <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="form-control"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  required
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2024/2025">2024/2025</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Lembaga Penyelenggara</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: Direktorat KSKK Madrasah Kemenag RI"
                  value={formData.organizer}
                  onChange={(e) => handleChange('organizer', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Nama Siswa / Delegasi <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nama lengkap siswa peraih prestasi"
                  value={formData.studentName}
                  onChange={(e) => handleChange('studentName', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kelas & NISN</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contoh: XII IPA 1 (NISN: 0087412993)"
                  value={formData.studentClass}
                  onChange={(e) => handleChange('studentClass', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guru Pembimbing</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nama pembimbing pendamping"
                  value={formData.mentorName}
                  onChange={(e) => handleChange('mentorName', e.target.value)}
                />
              </div>

              {!isAchieved && (
                <div className="form-group">
                  <label className="form-label">Status Tahap Persiapan</label>
                  <select
                    className="form-control"
                    value={formData.stage}
                    onChange={(e) => handleChange('stage', e.target.value)}
                  >
                    <option value="Pendaftaran Berkas">Pendaftaran Berkas</option>
                    <option value="Pembinaan Intensif">Pembinaan Intensif</option>
                    <option value="Uji Coba & Simulasi">Uji Coba & Simulasi</option>
                    <option value="Delegasi Berangkat">Delegasi Berangkat</option>
                    <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                  </select>
                </div>
              )}

              <div className="form-group full-width">
                <label className="form-label">Catatan / Deskripsi Singkat</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Catatan tambahan mengenai prestasi atau persiapan lomba"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================================================
// 2. QUICK CONVERT MODAL (UPCOMING -> ACHIEVED)
// ==========================================================================
export function ConvertModal({ isOpen, onClose, item, onConfirm }) {
  const [rank, setRank] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setRank(
        item.targetRank ? item.targetRank.replace('Target: ', '') : 'Juara 1 (Medali Emas)'
      );
      setDate(new Date().toISOString().split('T')[0]);
      setNotes(item.notes || '');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(item.id, { rank, date, notes });
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3>🎉 Catat Hasil Kejuaraan Lomba</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '16px'
              }}
            >
              Lomba telah selesai diselenggarakan! Masukkan hasil perolehan juara siswa
              untuk memindahkannya ke daftar{' '}
              <strong>Prestasi yang Sudah Diraih</strong>.
            </p>

            <div className="form-group full-width" style={{ marginBottom: '12px' }}>
              <label className="form-label">Nama Lomba</label>
              <input
                type="text"
                className="form-control"
                value={item.title}
                readOnly
                style={{ background: 'var(--bg-muted)', fontWeight: 700 }}
              />
            </div>

            <div className="form-group full-width" style={{ marginBottom: '12px' }}>
              <label className="form-label">Siswa Delegasi</label>
              <input
                type="text"
                className="form-control"
                value={`${item.studentName} (${item.studentClass || '-'})`}
                readOnly
                style={{ background: 'var(--bg-muted)' }}
              />
            </div>

            <div className="form-group full-width" style={{ marginBottom: '12px' }}>
              <label className="form-label">
                Juara / Hasil yang Diraih <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Juara 1 (Medali Emas)"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width" style={{ marginBottom: '12px' }}>
              <label className="form-label">
                Tanggal Pengumuman / Penghargaan <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Catatan Tambahan / Hadiah</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Piala Bergilir + Beasiswa Pembinaan"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-gold">
              🏆 Konfirmasi & Pindahkan ke Prestasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================================================
// 3. CERTIFICATE MODAL
// ==========================================================================
export function CertificateModal({ isOpen, onClose, item }) {
  if (!isOpen || !item) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-content" style={{ maxWidth: '740px' }}>
        <div className="modal-header">
          <h3>📜 Bukti Sertifikat / Piagam Penghargaan</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="certificate-preview-container">
            <img
              src="./assets/certificate.jpg"
              alt="Bukti Sertifikat Prestasi"
              className="cert-image"
            />
            <div style={{ textAlign: 'center' }}>
              <h4
                style={{
                  fontSize: '1.15rem',
                  color: 'var(--text-main)',
                  marginBottom: '4px'
                }}
              >
                {item.studentName}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {item.rank} - {item.title} ({item.level})
              </p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
          <a
            href="./assets/certificate.jpg"
            download="Sertifikat_Prestasi_Madrasah.jpg"
            className="btn btn-primary"
          >
            <span>⬇️</span> Unduh Salinan Sertifikat
          </a>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 4. OFFICIAL PRINT MODAL (KOP SURAT KEMENAG)
// ==========================================================================
export function OfficialPrintModal({ isOpen, onClose, records }) {
  if (!isOpen) return null;

  const achievedList = records.filter((r) => r.type === 'achieved');
  const todayStr = '16 Oktober 2026';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay active">
      <div
        className="modal-content"
        style={{ maxWidth: '860px', background: '#ffffff' }}
      >
        <div className="modal-header no-print">
          <h3>🖨️ Format Cetak Laporan Rekapitulasi Resmi</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body" style={{ padding: 0 }}>
          <div className="official-print-document">
            {/* Kop Surat Madrasah */}
            <div className="print-letterhead">
              <img
                src="./assets/logo.jpg"
                alt="Logo Kemenag"
                className="print-letterhead-logo"
              />
              <div className="print-letterhead-text">
                <h2>KEMENTERIAN AGAMA REPUBLIK INDONESIA</h2>
                <h3>KANTOR KEMENTERIAN AGAMA KABUPATEN/KOTA</h3>
                <h3>MADRASAH ALIYAH NEGERI (MAN) UNGGULAN TERPADU</h3>
                <p>
                  Jalan Pendidikan No. 77 Kompleks Sains Terpadu, Telp. (021) 7894561 Kode
                  Pos 15412
                </p>
                <p>
                  Email: kesiswaan@man-unggulan.sch.id | Website: www.man-unggulan.sch.id
                </p>
              </div>
            </div>

            {/* Judul Laporan */}
            <div className="print-doc-title">
              <h4>REKAPITULASI CAPAIAN PRESTASI SISWA AKADEMIK DAN NON-AKADEMIK</h4>
              <p>
                Tahun Pelajaran 2026/2027 | Nomor: B-814/Ma.11.02/PP.00.6/10/2026
              </p>
            </div>

            <div
              style={{
                fontSize: '9pt',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>
                <strong>Kategori:</strong> Seluruh Kategori (Akademik & Non-Akademik)
              </span>
              <span>
                <strong>Tanggal Cetak:</strong> {todayStr}
              </span>
            </div>

            {/* Print Table */}
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{ width: '28px' }}>No</th>
                  <th style={{ width: '140px' }}>Nama Siswa / Tim</th>
                  <th style={{ width: '70px' }}>Kelas</th>
                  <th>Nama Kejuaraan / Kompetisi</th>
                  <th style={{ width: '75px' }}>Kategori</th>
                  <th style={{ width: '80px' }}>Tingkat</th>
                  <th style={{ width: '105px' }}>Peringkat</th>
                  <th style={{ width: '120px' }}>Guru Pembimbing</th>
                </tr>
              </thead>
              <tbody>
                {achievedList.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td>
                      <strong>{item.studentName}</strong>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.studentClass || '-'}</td>
                    <td>{item.title}</td>
                    <td style={{ textAlign: 'center' }}>{item.category}</td>
                    <td style={{ textAlign: 'center' }}>{item.level}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {item.rank || '-'}
                    </td>
                    <td>{item.mentorName || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures */}
            <div className="print-signatures">
              <div className="signature-box">
                <p>Mengetahui,</p>
                <p>Waka Kesiswaan</p>
                <div className="signature-space"></div>
                <p className="signature-name">Ahmad Fauzi, S.Kom</p>
                <p>NIP. 19820514 200801 1 015</p>
              </div>

              <div className="signature-box">
                <p>Ditetapkan di: Madrasah</p>
                <p>Kepala Madrasah Aliyah,</p>
                <div className="signature-space"></div>
                <p className="signature-name">Dr. H. Miftahul Ulum, M.Ag</p>
                <p>NIP. 19750812 200003 1 002</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer no-print">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Tutup
          </button>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>
            <span>🖨️</span> Cetak / Simpan PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 5. ROLE GUIDE MODAL
// ==========================================================================
export function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h3>ℹ️ Alur & Panduan Penggunaan Sistem</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
          <h4 style={{ color: 'var(--primary-700)', marginBottom: '8px' }}>
            1. Peran Administrator Kesiswaan (👨‍💼)
          </h4>
          <p style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>
            Memiliki akses penuh untuk memasukkan data prestasi, mengedit atau
            menghapus entri, memverifikasi keabsahan sertifikat, dan mengunduh
            database backup.
          </p>

          <h4 style={{ color: 'var(--primary-700)', marginBottom: '8px' }}>
            2. Peran Kepala Madrasah (🎓)
          </h4>
          <p style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>
            Didesain untuk pimpinan madrasah untuk melihat rekapitulasi eksekutif:
            statistik medali emas/perak, perbandingan prestasi akademik vs non-akademik,
            grafik capaian bulanan, serta mengesahkan dan{' '}
            <strong>Mencetak Dokumen Rekapitulasi Resmi Berkop Surat</strong>.
          </p>

          <h4 style={{ color: 'var(--primary-700)', marginBottom: '8px' }}>
            3. Peran Guru Pembimbing (👩‍🏫)
          </h4>
          <p style={{ marginBottom: '14px', color: 'var(--text-muted)' }}>
            Fokus pada bimbingan siswa: Mendaftarkan{' '}
            <strong>Agenda Lomba yang Akan Datang</strong>, memantau tahapan
            pembinaan/karantina lomba, dan ketika lomba selesai cukup klik{' '}
            <strong>"🎉 Selesaikan & Catat Juara"</strong> untuk otomatis mengonversi ke
            prestasi diraih!
          </p>

          <div
            style={{
              background: 'var(--bg-muted)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--gold-500)',
              marginTop: '10px'
            }}
          >
            <strong>💡 Tips:</strong> Anda dapat mengganti peran kapan saja melalui
            dropdown di pojok kanan atas untuk melihat tampilan dan fitur sesuai sudut
            pandang masing-masing aktor sekolah.
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================================
// 6. TOAST CONTAINER
// ==========================================================================
export function ToastNotification({ toasts }) {
  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((toast) => (
        <div className={`toast toast-${toast.type}`} key={toast.id}>
          <span>{toast.type === 'success' ? '✅' : 'ℹ️'}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

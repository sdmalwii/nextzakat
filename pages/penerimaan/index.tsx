import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaMosque, FaSearch, FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineForm, AiOutlineGift } from 'react-icons/ai';
import { CiMenuBurger } from 'react-icons/ci';
import styles from '../../styles/penerimaan.module.css';
import withAuth from '../../utils/Auth';
import * as XLSX from 'xlsx';

interface PenerimaanData {
  Id_Penerima: string;
  Id_Mustahik: string;
  Nama: string;
  Alamat: string;
  Jenis_Kelamin: string;
  Golongan: string;
  Usia: string;
  Jumlah_Beras: number;
  Tanggal_Terima: string;
}

const PenerimaanZakat: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [data, setData] = useState<PenerimaanData[]>([]);
  const [form, setForm] = useState<PenerimaanData>({
    Id_Penerima: '',
    Id_Mustahik: 'MK-MAH-001',
    Nama: '',
    Alamat: '',
    Jenis_Kelamin: '',
    Golongan: '',
    Usia: '',
    Jumlah_Beras: 0,
    Tanggal_Terima: new Date().toISOString().split('T')[0],
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tbl_penerimaan');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      alert('Gagal memuat data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'Jumlah_Beras' ? parseFloat(value) : value,
    }));
  };

  const openCreate = () => {
    setForm({
      Id_Penerima: '',
      Id_Mustahik: 'MK-MAH-001',
      Nama: '',
      Alamat: '',
      Jenis_Kelamin: '',
      Golongan: '',
      Usia: '',
      Jumlah_Beras: 0,
      Tanggal_Terima: new Date().toISOString().split('T')[0],
    });

    setIsEdit(false);
    setEditId('');
    setShowModal(true);
  };

  const openEdit = (item: PenerimaanData) => {
    setForm({
      ...item,
      Tanggal_Terima: item.Tanggal_Terima.split('T')[0],
    });
    setEditId(item.Id_Penerima);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEdit ? `http://localhost:5000/api/tbl_penerimaan/${editId}` : 'http://localhost:5000/api/tbl_penerimaan';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (json.success) {
        alert(json.message);
        setShowModal(false);
        fetchData();
      } else {
        alert(`Gagal menyimpan data: ${json.message}`);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tbl_penerimaan/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        alert(json.message);
        fetchData();
      } else {
        alert(`Gagal hapus: ${json.message}`);
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menghapus.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const filtered = data.filter(d =>
    d.Id_Mustahik.toLowerCase().includes(search.toLowerCase()) ||
    d.Nama.toLowerCase().includes(search.toLowerCase())
  );

// Tambahkan fungsi ini di dalam komponen PenerimaanZakat (sebelum return)
const exportToExcel = () => {
  // Format data untuk Excel
  const excelData = filtered.map((item, index) => ({
    No: index + 1,
    'ID Mustahik': item.Id_Mustahik,
    Nama: item.Nama,
    Alamat: item.Alamat,
    'Jenis Kelamin': item.Jenis_Kelamin,
    Golongan: item.Golongan,
    Usia: item.Usia,
    'Jumlah Beras (Liter)': item.Jumlah_Beras,
    'Tanggal Terima': new Date(item.Tanggal_Terima).toLocaleDateString('id-ID')
  }));

  // Buat worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Buat workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Penerimaan Zakat");
  
  // Export ke file Excel
  XLSX.writeFile(wb, `Laporan_Penerimaan_Zakat_${new Date().toISOString().split('T')[0]}.xlsx`);
};

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
        <div className={styles.logo}>
          <FaMosque className={styles.logoIcon} />
          {isSidebarOpen && <span className={styles.logoText}>Musholla Al-Hidayah</span>}
        </div>
        <nav>
          <Link href="/dashboard" className={styles.menuItem}><AiOutlineHome className={styles.menuIcon} />{isSidebarOpen && <span>Dashboard</span>}</Link>
          <Link href="/pencatatan" className={styles.menuItem}><AiOutlineForm className={styles.menuIcon} />{isSidebarOpen && <span>Pencatatan Zakat</span>}</Link>
          <Link href="/penerimaan" className={styles.menuItem}><AiOutlineGift className={styles.menuIcon} />{isSidebarOpen && <span>Penerimaan Zakat</span>}</Link>
        </nav>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.actionBar}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={styles.menuButton}><CiMenuBurger className={styles.menuIcon} /></button>
          <div className={styles.profileContainer}>
            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className={styles.profileButton}><FaUserCircle className={styles.profileIcon} /></button>
            {isProfileDropdownOpen && (
              <div className={styles.profileDropdown}>
                <button onClick={handleLogout} className={styles.dropdownItem}>Logout</button>
              </div>
            )}
          </div>
          <div className={styles.rightActions}>
            <div className={styles.searchContainer}>
              <FaSearch className={styles.searchIcon} />
              <input type="text" placeholder="Cari Id Muzaki..." value={search} onChange={e => setSearch(e.target.value)} className={styles.searchInput} />
            </div>
            <button onClick={openCreate} className={styles.addButton}>Tambah Data</button>
            <button onClick={exportToExcel} className={styles.addButtonlaporan}>Buat Laporan</button>          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Id Mustahik</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Jenis Kelamin</th>
                <th>Golongan</th>
                <th>Usia</th>
                <th>Jumlah Beras</th>
                <th>Tanggal Terima</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.Id_Penerima}>
                  <td>{i + 1}</td>
                  <td>{d.Id_Mustahik}</td>
                  <td>{d.Nama}</td>
                  <td>{d.Alamat}</td>
                  <td>{d.Jenis_Kelamin}</td>
                  <td>{d.Golongan}</td>
                  <td>{d.Usia}</td>
                  <td>{d.Jumlah_Beras} Liter</td>
                  <td>{new Date(d.Tanggal_Terima).toLocaleDateString('id-ID')}</td>
                  <td className={styles.actionCell}>
                    <button onClick={() => openEdit(d)} className={styles.editButton}><FaEdit /></button>
                    <button onClick={() => handleDelete(d.Id_Penerima)} className={styles.deleteButton}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className={styles.noData}>Data Kosong</div>}
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{isEdit ? 'Edit Data Pennerimaan Zakat' : 'Tambah Data Penerimaan Zakat'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nomor Penerimaan</label>
                <input name="Id_Penerima" value={form.Id_Penerima} onChange={handleChange} disabled={isEdit} required />
              </div>
              <div className={styles.formGroup}>
                <label>Id Mustahik</label>
                <input name="Id_Mustahik" value={form.Id_Mustahik} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Nama</label>
                <input name="Nama" value={form.Nama} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Alamat</label>
                <input name="Alamat" value={form.Alamat} onChange={handleChange} required />
              </div>
              
              <div className={styles.formRowFlex}>
              <div className={styles.formGroup}>
                <label>Jenis Kelamin</label>
                <select name="Jenis_Kelamin" value={form.Jenis_Kelamin} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Golongan</label>
                <select name="Golongan" value={form.Golongan} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  <option value="">Pilih</option>
                  <option value="Fakir">Fakir</option>
                  <option value="Miskin">Miskin</option>
                  <option value="Hamba sahaya">Hamba Sahaya</option>
                  <option value="Gharim">Gharim</option>
                  <option value="Mualaf">Mualaf</option>
                  <option value="Fii Sabilillah">Fii Sabilillah</option>
                  <option value="Musafir">Musafir</option>
                  <option value="Amil">Amil</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Usia</label>
                <select name="Usia" value={form.Usia} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  {[...Array(86)].map((_, i) => {
                    const usia = i + 0; 
                    return (
                      <option key={usia} value={usia}>
                        {usia}
                      </option>
                    );
                  })}
                </select>
              </div>
              </div>

              <div className={styles.formGroup}>
                <label>Jumlah Beras</label>
                <input type="number" name="Jumlah_Beras" value={form.Jumlah_Beras} onChange={handleChange} min="0" step="0.5" required />
              </div>
              <div className={styles.formGroup}>
                <label>Tanggal Terima</label>
                <input type="date" name="Tanggal_Terima" value={form.Tanggal_Terima} onChange={handleChange} required />
              </div>
              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>Batal</button>
                <button type="submit" className={styles.submitButton}>{isEdit ? 'Update' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(PenerimaanZakat);
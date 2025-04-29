import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaMosque, FaSearch, FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineForm, AiOutlineGift } from 'react-icons/ai';
import { CiMenuBurger } from 'react-icons/ci';
import styles from '../../styles/pencatatan.module.css';
import withAuth from '../../utils/Auth';

interface PencatatanData {
  Id_Pencatatan: string;
  Id_Muzaki: string;
  Nama: string;
  Jenis_Kelamin: string;
  Nama_Ayah: string;
  Jumlah_Beras: number;
  Tanggal_Catat: string;
}

const PencatatanZakat: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [data, setData] = useState<PencatatanData[]>([]);
  const [form, setForm] = useState<PencatatanData>({
    Id_Pencatatan: '',
    Id_Muzaki: 'MZ-MAH-001',
    Nama: '',
    Jenis_Kelamin: '',
    Nama_Ayah: '',
    Jumlah_Beras: 0,
    Tanggal_Catat: new Date().toISOString().split('T')[0],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tbl_pencatatan');
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
      Id_Pencatatan: '',
      Id_Muzaki: 'MZ-MAH-001',
      Nama: '',
      Jenis_Kelamin: '',
      Nama_Ayah: '',
      Jumlah_Beras: 0,
      Tanggal_Catat: new Date().toISOString().split('T')[0],
    });
    setIsEdit(false);
    setEditId('');
    setShowModal(true);
  };

  const openEdit = (item: PencatatanData) => {
    setForm({
      ...item,
      Tanggal_Catat: item.Tanggal_Catat.split('T')[0],
    });
    setEditId(item.Id_Pencatatan);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEdit ? `http://localhost:5000/api/tbl_pencatatan/${editId}` : 'http://localhost:5000/api/tbl_pencatatan';
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
      const res = await fetch(`http://localhost:5000/api/tbl_pencatatan/${id}`, { method: 'DELETE' });
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
    d.Id_Muzaki.toLowerCase().includes(search.toLowerCase()) ||
    d.Nama.toLowerCase().includes(search.toLowerCase())
  );

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
            <button className={styles.addButtonlaporan}>Buat Laporan</button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Id Muzaki</th>
                <th>Nama</th>
                <th>Jenis Kelamin</th>
                <th>Nama Ayah</th>
                <th>Jumlah Beras</th>
                <th>Tanggal Catat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.Id_Pencatatan}>
                  <td>{i + 1}</td>
                  <td>{d.Id_Muzaki}</td>
                  <td>{d.Nama}</td>
                  <td>{d.Jenis_Kelamin}</td>
                  <td>{d.Nama_Ayah || '-'}</td>
                  <td>{d.Jumlah_Beras} Liter</td>
                  <td>{new Date(d.Tanggal_Catat).toLocaleDateString('id-ID')}</td>
                  <td className={styles.actionCell}>
                    <button onClick={() => openEdit(d)} className={styles.editButton}><FaEdit /></button>
                    <button onClick={() => handleDelete(d.Id_Pencatatan)} className={styles.deleteButton}><FaTrash /></button>
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
            <h2>{isEdit ? 'Edit Data Pencatatan Zakat' : 'Tambah Data Pencatatan Zakat'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nomor Pencatatan</label>
                <input name="Id_Pencatatan" value={form.Id_Pencatatan} onChange={handleChange} disabled={isEdit} required />
              </div>
              <div className={styles.formGroup}>
                <label>Id Muzaki</label>
                <input name="Id_Muzaki" value={form.Id_Muzaki} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Nama</label>
                <input name="Nama" value={form.Nama} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Jenis Kelamin</label>
                <select name="Jenis_Kelamin" value={form.Jenis_Kelamin} onChange={handleChange} required>
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Nama Ayah</label>
                <input name="Nama_Ayah" value={form.Nama_Ayah} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Jumlah Beras</label>
                <input type="number" name="Jumlah_Beras" value={form.Jumlah_Beras} onChange={handleChange} min="0" step="0.5" required />
              </div>
              <div className={styles.formGroup}>
                <label>Tanggal Catat</label>
                <input type="date" name="Tanggal_Catat" value={form.Tanggal_Catat} onChange={handleChange} required />
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

export default withAuth(PencatatanZakat);
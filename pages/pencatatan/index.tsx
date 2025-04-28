import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaMosque, FaSearch, FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineForm, AiOutlineGift } from 'react-icons/ai';
import { CiMenuBurger } from 'react-icons/ci';
import styles from '../../styles/pencatatan.module.css';

interface PencatatanData {
  Id_Pencatatan: string;
  Id_Muzaki: string;
  Nama: string;
  Jenis_Kelamin: string;
  Nama_Ayah: string;
  Jumlah_Beras: number;
  Tanggal_Catat: string;
}

function PencatatanZakat() {
    // State untuk UI
    const [search, setSearch] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk data
    const [dataPencatatan, setDataPencatatan] = useState<PencatatanData[]>([]);
    const [formData, setFormData] = useState({
        Id_Pencatatan: '',
        Id_Muzaki: 'MZ-MAH-001',
        Nama: '',
        Jenis_Kelamin: '',
        Nama_Ayah: '',
        Jumlah_Beras: 0,
        Tanggal_Catat: new Date().toISOString().split('T')[0]
    });

    // State untuk edit mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState('');

    // Daftar ID Muzaki
    const idOptions = Array.from({ length: 100 }, (_, i) => `MZ-MAH-${(i + 1).toString().padStart(3, '0')}`);

    // Fungsi untuk mengambil data dari backend
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tbl_pencatatan');
            const result = await response.json();

            if (result.success) {
                setDataPencatatan(result.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Gagal mengambil data dari server');
        }
    };

    // Ambil data saat komponen pertama kali render
    useEffect(() => {
        fetchData();
    }, []);

    // Fungsi untuk handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fungsi untuk handle perubahan ID Muzaki manual
    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setFormData(prev => ({
            ...prev,
            Id_Muzaki: `MZ-MAH-${value}`
        }));
    };

    // Fungsi untuk submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = isEditMode
            ? `http://localhost:5000/api/tbl_pencatatan/${currentEditId}`
            : 'http://localhost:5000/api/tbl_pencatatan';

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                alert(`Data berhasil ${isEditMode ? 'diupdate' : 'disimpan'}!`);
                closeModal();
                fetchData();
            } else {
                alert('Gagal menyimpan data: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menyimpan data');
        }
    };

    // Fungsi untuk edit data
    const handleEdit = (data: PencatatanData) => {
        setFormData({
            Id_Pencatatan: data.Id_Pencatatan,
            Id_Muzaki: data.Id_Muzaki,
            Nama: data.Nama,
            Jenis_Kelamin: data.Jenis_Kelamin,
            Nama_Ayah: data.Nama_Ayah,
            Jumlah_Beras: data.Jumlah_Beras,
            Tanggal_Catat: data.Tanggal_Catat.split('T')[0]
        });
        setCurrentEditId(data.Id_Muzaki);
        setIsEditMode(true);
        openModal();
    };

    // Fungsi untuk hapus data
    const handleDelete = async (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/tbl_pencatatan/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    alert('Data berhasil dihapus!');
                    fetchData();
                } else {
                    alert('Gagal menghapus data: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat menghapus data');
            }
        }
    };

    // Fungsi untuk UI
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
    const handleLogout = () => console.log('Logout berhasil');

    const openModal = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setCurrentEditId('');
        setFormData({
            Id_Pencatatan: '',
            Id_Muzaki: 'MZ-MAH-001',
            Nama: '',
            Jenis_Kelamin: '',
            Nama_Ayah: '',
            Jumlah_Beras: 0,
            Tanggal_Catat: new Date().toISOString().split('T')[0]
        });
    };

    const closeModal = () => setIsModalOpen(false);

    // Filter data berdasarkan search
    const filteredData = dataPencatatan.filter(item => item.Id_Muzaki.toLowerCase().includes(search.toLowerCase()) ||
        item.Nama.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={styles.container}>
            {/* SIDEBAR */}
            <div className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.sidebarClosed}`}>
                <div className={styles.logo}>
                    <FaMosque className={styles.logoIcon} />
                    {isSidebarOpen && <span className={styles.logoText}>Musholla Al-Hidayah</span>}
                </div>

                {/* Menu Navigasi */}
                <nav>
                    <Link href="/dashboard" className={styles.menuItem} style={{ textDecoration: 'none' }}>
                        <AiOutlineHome className={styles.menuIcon} />
                        {isSidebarOpen && <span>Dashboard</span>}
                    </Link>
                    <Link href="/pencatatan" className={styles.menuItem} style={{ textDecoration: 'none' }}>
                        <AiOutlineForm className={styles.menuIcon} />
                        {isSidebarOpen && <span>Pencatatan Zakat</span>}
                    </Link>
                    <Link href="/penerimaan" className={styles.menuItem} style={{ textDecoration: 'none' }}>
                        <AiOutlineGift className={styles.menuIcon} />
                        {isSidebarOpen && <span>Penerimaan Zakat</span>}
                    </Link>
                </nav>
            </div>

            {/* KONTEN UTAMA */}
            <div className={styles.mainContent}>
                <div className={styles.actionBar}>
                    <button onClick={toggleSidebar} className={styles.menuButton}>
                        <CiMenuBurger className={styles.menuIcon} />
                    </button>

                    <div className={styles.profileContainer}>
                        <button onClick={toggleProfileDropdown} className={styles.profileButton}>
                            <FaUserCircle className={styles.profileIcon} />
                        </button>
                        {isProfileDropdownOpen && (
                            <div className={styles.profileDropdown}>
                                <button onClick={handleLogout} className={styles.dropdownItem}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.rightActions}>
                        <div className={styles.searchContainer}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Cari Id Muzaki..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className={styles.searchInput} />
                        </div>

                        <button onClick={openModal} className={styles.addButton}>
                            Tambah Data
                        </button>

                        <button className={styles.addButtonlaporan}>
                            Buat Laporan
                        </button>
                    </div>
                </div>

                {/* TABEL DATA */}
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
                            {filteredData.map((item, index) => (
                                <tr key={item.Id_Pencatatan}>
                                    <td>{index + 1}</td>
                                    <td>{item.Id_Muzaki}</td>
                                    <td>{item.Nama}</td>
                                    <td>{item.Jenis_Kelamin}</td>
                                    <td>{item.Nama_Ayah || '-'}</td>
                                    <td>{item.Jumlah_Beras} Liter</td>
                                    <td>{new Date(item.Tanggal_Catat).toLocaleDateString('id-ID')}</td>
                                    <td className={styles.actionCell}>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className={styles.editButton}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.Id_Muzaki)}
                                            className={styles.deleteButton}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredData.length === 0 && (
                        <div className={styles.noData}>
                            Data Kosong
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL FORM TAMBAH/EDIT DATA */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{isEditMode ? 'Edit' : 'Tambah'} Data Pencatatan Zakat</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Nomor Pencatatan</label>
                                <input
                                    type="text"
                                    name="Id_Pencatatan"
                                    value={formData.Id_Pencatatan}
                                    onChange={handleInputChange}
                                    required />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Id Muzaki</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        name="Id_Muzaki"
                                        value={formData.Id_Muzaki}
                                        onChange={handleIdChange}
                                        required
                                        style={{ padding: '8px', fontSize: '16px' }} />
                                    <select
                                        name="Id_Muzaki"
                                        onChange={handleInputChange}
                                        value={formData.Id_Muzaki}
                                        className={styles.selectDropdown}
                                    >
                                        {idOptions.map((id) => (
                                            <option key={id} value={id}>
                                                {id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Nama</label>
                                <input
                                    type="text"
                                    name="Nama"
                                    value={formData.Nama}
                                    onChange={handleInputChange}
                                    required />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Jenis Kelamin</label>
                                <select
                                    name="Jenis_Kelamin"
                                    value={formData.Jenis_Kelamin}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Pilih</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Nama Ayah</label>
                                <input
                                    type="text"
                                    name="Nama_Ayah"
                                    value={formData.Nama_Ayah}
                                    onChange={handleInputChange} />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Jumlah Beras</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="number"
                                        name="Jumlah_Beras"
                                        min="0"
                                        step="0.5"
                                        value={formData.Jumlah_Beras}
                                        onChange={handleInputChange}
                                        required />
                                    <span>Liter</span>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Tanggal Catat</label>
                                <input
                                    type="date"
                                    name="Tanggal_Catat"
                                    value={formData.Tanggal_Catat}
                                    onChange={handleInputChange}
                                    required />
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={styles.cancelButton}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                >
                                    {isEditMode ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PencatatanZakat;
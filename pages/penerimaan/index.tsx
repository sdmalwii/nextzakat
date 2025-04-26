import React, { useState } from 'react';
import Link from 'next/link';
import { FaMosque, FaSearch, FaUserCircle } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineForm, AiOutlineGift } from 'react-icons/ai';
import { CiMenuBurger } from 'react-icons/ci';
import styles from '../../styles/penerimaan.module.css';

  const PenerimaanZakat = () => {
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idMustahik, setIdMustahik] = useState('MK-MAH-001');

  // Daftar ID Mustahik yang bisa dipilih
  const idOptions = Array.from({ length: 100 }, (_, i) => `MK-MAH-${(i + 1).toString().padStart(3, '0')}`);
  
  // Fungsi untuk mengubah ID Muzaki 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/\D/g, ''); // Hanya angka yang boleh masuk
    setIdMustahik(`MK-MAH-${value}`);
    };
  
  // Fungsi untuk memilih ID dari dropdown
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIdMustahik(e.target.value);
    };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const handleLogout = () => console.log('Logout berhasil');
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Data berhasil disimpan');
    closeModal();
  };

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
                placeholder="Cari Id Mustahik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{/* Data akan ditampilkan di sini */}</tbody>
        </table>
      </div>

      {/* MODAL FORM TAMBAH DATA */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Tambah Data Penerimaan Zakat</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nomor</label>
                <input type="number" required />
              </div>

              <div className={styles.formGroup}>
                <label>Id Mustahik</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={idMustahik}
                    onChange={handleChange}
                    required
                    style={{ padding: '8px', fontSize: '16px' }}
                  />
                 <select 
                    onChange={handleSelect} 
                    value={idMustahik} 
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
                <input type="text" required />
              </div>

              <div className={styles.formGroup}>
                <label>Alamat</label>
                <input type="text" required />
              </div>
  
              <div className={styles.formRowFlex}>
                  {/* Jenis Kelamin */}
              <div className={styles.formGroup}>
                <label>Jenis Kelamin</label>
                <select required>
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              
              {/* Golongan */}
              <div className={styles.formGroup}>
                <label>Golongan</label>
                <select required>
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
                <select required>
                  <option value="">Pilih</option>
                  {[...Array(66)].map((_, i) => {
                    const usia = i + 15; // Mulai dari 15 hingga 80
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.5" 
                    required 
                  />
                  <span>Liter</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Tanggal Terima</label>
                <input type="date" required />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={closeModal} className={styles.cancelButton}>
                  Batal
                </button>
                <button type="submit" className={styles.submitButton}>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenerimaanZakat;
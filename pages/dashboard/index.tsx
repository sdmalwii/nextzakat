import React, { useState, useEffect } from 'react';
  import Link from 'next/link';
import { FaMosque, FaUserCircle } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineForm, AiOutlineGift } from 'react-icons/ai';
import { CiMenuBurger } from 'react-icons/ci';
import styles from '../../styles/dashboard.module.css';
import withAuth from "../../utils/Auth";
import { useRouter } from 'next/router';


interface PencatatanData {
  Jumlah_Jiwa: number;
  Jumlah_Beras: number;
}

interface PenerimaanData {
  Jumlah_Beras: number;
  Nama: string;
}

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const [TotalJiwaMuzaki, setTotalJiwaMuzaki] = useState(0);
  const [TotalBerasMuzaki, setTotalBerasMuzaki] = useState(0);
  const [TotalJiwaMustahik, setTotalJiwaMustahik] = useState(0);
  const [TotalBerasMustahik, setTotalBerasMustahik] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchPencatatanData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tbl_pencatatan');
        const json = await res.json();
        
        if (json.success) {
          const jiwaTotalMuzaki = json.data.reduce((sum: number, item: any) => {
            return sum + (typeof item.Jumlah_Jiwa === 'string' 
              ? parseInt(item.Jumlah_Jiwa) 
              : item.Jumlah_Jiwa);
          }, 0);
          
          const berasTotalMuzaki = json.data.reduce((sum: number, item: any) => {
            return sum + (typeof item.Jumlah_Beras === 'string'
              ? parseFloat(item.Jumlah_Beras)
              : item.Jumlah_Beras);
          }, 0);
          
          setTotalJiwaMuzaki(jiwaTotalMuzaki);
          setTotalBerasMuzaki(berasTotalMuzaki);
        }
      } catch (err) {
        console.error('Gagal memuat data pencatatan:', err);
      }
    };
  
    const fetchPenerimaanData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/tbl_penerimaan');
        const json = await res.json();
        
        if (json.success) {
          const berasTotalMustahik = json.data.reduce((sum: number, item: any) => {
            return sum + (typeof item.Jumlah_Beras === 'string'
              ? parseFloat(item.Jumlah_Beras)
              : item.Jumlah_Beras);
          }, 0);

          const jiwaTotalMustahik = json.data.length; // <- Ini yang diubah buat total orang di mustahik nya
          
          setTotalBerasMustahik(berasTotalMustahik);
          setTotalJiwaMustahik(jiwaTotalMustahik);
        }
      } catch (err) {
        console.error('Gagal memuat data penerimaan:', err);
      }
    };
  
    // Panggil kedua fungsi fetch
    fetchPencatatanData();
    fetchPenerimaanData();
  }, []);

  
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
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    localStorage.removeItem("isLoggedIn");
                    router.push("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CARD SECTION */}
      
<div className={styles.cardContainer}>
  {/* Card 1 dengan gambar */}
  <div className={`${styles.card} ${styles.cardWithImage}`}>
    <img
      src="/1.jpg" // Ganti dengan path gambar Anda
      alt="Jiwa Muzaki"
      className={styles.cardImageHeader}
    />
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>Jumlah Penyalur Zakat</h3>
      <p className={styles.cardValue}>{TotalJiwaMuzaki} Orang</p>
    </div>
  </div>

  {/* Card 2 dengan gambar */}
  <div className={`${styles.card} ${styles.cardWithImage}`}>
    <img
      src="/2.png" // Ganti dengan path gambar Anda
      alt="Beras Muzaki"
      className={styles.cardImageHeader}
    />
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>Total Beras Penyalur Zakat</h3>
      <p className={styles.cardValue}>{TotalBerasMuzaki} Liter</p>
    </div>
  </div>

  {/* Card 3 dengan gambar */}
  <div className={`${styles.card} ${styles.cardWithImage}`}>
    <img
      src="3.png" // Ganti dengan path gambar Anda
      alt="Mustahik"
      className={styles.cardImageHeader}
    />
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>Jumlah Penerima Zakat</h3>
      <p className={styles.cardValue}>{TotalJiwaMustahik} Orang</p>
    </div>
  </div>

  <div className={`${styles.card} ${styles.cardWithImage}`}>
    <img
      src="/4.png" // Ganti dengan path gambar Anda
      alt="Mustahik"
      className={styles.cardImageHeader}
    />
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>Total Beras Penerima Zakat</h3>
      <p className={styles.cardValue}>{TotalBerasMustahik} Liter</p>
    </div>
  </div>
</div>

        </div>
      </div>

  );
};

export default withAuth(Dashboard);

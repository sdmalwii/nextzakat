import React, { useState } from 'react';
import Link from 'next/link';
import { FaMosque, FaUserCircle } from 'react-icons/fa';
import { AiOutlineHome, AiOutlineForm, AiOutlineGift } from 'react-icons/ai';
import { CiMenuBurger } from 'react-icons/ci';
import styles from '../../styles/dashboard.module.css';
import withAuth from "../../utils/Auth";
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const handleLogout = () => console.log('Logout berhasil');
  const router = useRouter();

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
                <button className={styles.dropdownItem}
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
      </div>     
    </div>
  );
};

export default withAuth(Dashboard);
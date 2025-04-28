import React, { useState } from "react";                                  //Untuk membuat variabel di React.
import styles from "../../styles/login.module.css";
import { useRouter } from "next/router";                                  //Untuk redirect (pindah halaman) setelah login sukses.

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");                                 //Menyimpan pesan error kalau login gagal.
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();                                                   //e.preventDefault(): Supaya form tidak reload browser saat diklik Submit.
    setError(""); // reset error sebelum submit

    try {
      const res = await fetch("http://localhost:5000/api/login", {        //fetch: mengirim data email dan password ke backend kamu (localhost:5000/api/login).
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),                        //Kirim dalam format JSON { email, password }.

      });

      const data = await res.json();                                      //Baca jawaban server (yang tadi bisa "Login berhasil" atau error lain).

      if (res.ok) {
        // bisa simpan user info ke localStorage / cookie kalau perlu
        router.push("/dashboard"); // ngarahin ke dashboard
      } else {
        setError(data.message || "Login gagal. Periksa kembali data.");
      }
    } catch (err) {                                                         //Misal server mati atau error koneksi, tampilkan pesan umum.
      setError("Gagal terhubung ke server. Silakan coba beberapa saat lagi."); 
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginBoxHeader}>Zakat Mushola Al-Hidayah</div>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red", marginTop: "-8px" }}>{error}</p>}

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

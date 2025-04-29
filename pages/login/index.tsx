import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Cek kalau sudah login, langsung redirect
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.back(); // balik ke halaman sebelumnya
      // router.push("/dashboard"); // alternatif: langsung ke dashboard
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError(data.message || "Login gagal. Periksa kembali data.");
      }
    } catch (err) {
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

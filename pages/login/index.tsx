import React, { useState } from "react";
import styles from '../../styles/login.module.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement backend call here
    console.log({ email, password });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginBoxHeader}>Login</div>
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="E-mail Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

<br /><br />

          <div className={styles.loginsubmit}>

          <button type="submit">Login</button>
         </div>
        </form>
      </div>
    </div>
  );
}

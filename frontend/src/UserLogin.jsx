import /*React,*/ { useState, useEffect} from "react";
import {useCookies} from "react-cookie";
//import bcrypt from "bcryptjs";

const UserLogin = () => {

  const [cookies, setCookies, removeCookies] = useCookies(["userCookies"])
  const API_URL = import.meta.env.VITE_API_URL;

  /*useEffect(() => {
    removeCookies("userCookies")
  }, [])*/


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errText, setErrText] = useState("");

  const sendLoginInfo = (e) => {
    e.preventDefault();
    //console.log("Username:", username);
    //console.log("Password:", password);

    //chiamata API
    //const hashPassword = bcrypt.hash(password, 10) 
    fetch(`${API_URL}/api/v2/auth`, {

      method: "POST",
      headers: {
        "Content-Type" : "application/json",
      }, 
      body: JSON.stringify({
        "username": username,
        "password": password
      })

    }).then(response => {

      return response.json();

    }).then(data => {
      console.log("LOGIN DATA:", data)

      //console.log(data)
      let success = data.success
      if(!success){
        setErrText(data.message)
        return
      }

      setCookies("userCookies", {
        token: data.token,
        username: data.username,
        name: data.name,
        id: data.id,
        role: data.role}, {path: "/", sameSite: "strict"})

        console.log("ROLE:", data.role)
      
        if(data.role==='admin')
          window.location.href = `${API_URL}/admin`
        else 
          window.location.href = `${API_URL}/`
    })

  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.info}>{errText}</p>
        <form onSubmit={sendLoginInfo} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    //backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },
  title: {
    color: "#4f46e5",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  info: {
    marginBottom: "0.75rem"
  }
};

export default UserLogin;
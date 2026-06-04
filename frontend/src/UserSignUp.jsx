import { useState } from "react";
import {useCookies} from "react-cookie";
import { useNavigate } from "react-router-dom";


const UserSignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errText, setErrText] = useState("");
  const [cookies, setCookies, removeCookies] = useCookies(["userCookies"])
  /*const [errors, setErrors] = useState({});*/


  const sendSignUpInfo = async (e) => {
    e.preventDefault();
    //console.log("submit partito");
    const API_URL = import.meta.env.VITE_API_URL;    

    try {
        const response = await fetch(`${API_URL}/api/v2/users/`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            name,
            surname,
            username,
            email,
            password,
        }),
    });

    //console.log("response arrivata", response);
    const data = await response.json();
    //console.log("data ricevuti", data);

    if (!response.ok) {
        setErrText(data.message)
        throw new Error(data.message || "Errore nella registrazione");
    }

    //console.log("Signup OK:", data);

    /*
    const params = new URLSearchParams({
        token: data.token,
        username: data.user.username,
        name: data.user.name,
        id: data.user.id,
        role: data.user.role,
    });
    */
    setCookies("userCookies", {
      token: data.token, 
      username: data.user.username,
      name: data.user.name,
      id: data.user.id,
      role: data.user.role}, {path: "/", sameSite: "strict"})
    navigate("/");

  } catch (error) {
    console.error(error.message);
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registrazione</h2>
        <p style={styles.info}>{errText}</p>
        <form onSubmit={sendSignUpInfo} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          {/*} {errors.name && <p style={styles.error}>{errors.name}</p>} */}

          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            style={styles.input}
            required
          />
          {/* {errors.surname && <p style={styles.error}>{errors.surname}</p>} */}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          {/* {errors.username && <p style={styles.error}>{errors.username}</p>} */}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Inserisci un'email valida, ad esempio nome@email.com"
            required
          />
          {/* {errors.email && <p style={styles.error}>{errors.email}</p>} */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            style={styles.input}
            title="La password deve contenere almeno 8 caratteri"
            required
          />
          {/* {errors.password && <p style={styles.error}>{errors.password}</p>} */}

          <button type="submit" style={styles.button}>
            Crea account
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
};

export default UserSignUp;
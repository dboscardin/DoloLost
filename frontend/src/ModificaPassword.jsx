import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ModificaPassword = (props) => {

  const [open, setOpen] = useState(false)

  const { userId } = useParams();
  const { token } = props;
  const [formData, setFormData] = useState({
    old_password: "", 
    new_password: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;  


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg("");
    try {
        const response = await fetch(`${API_URL}/api/v2/users/${userId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        },
        body: JSON.stringify(formData)
        });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.error || errorData.message || `Errore HTTP: ${response.status} `);
    }

  await response.json();

    setSuccessMsg("Dati aggiornati con successo!");  
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };


  if (!token) return <div style={styles.message}>Effettua il login per continuare.</div>;


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Modifica i tuoi dati</h2>

        <div style={styles.errorBox}>{error}</div>
        <div style={styles.successBox}>{successMsg}</div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Vecchia password:</label>
          <input
          type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <label style={styles.label}>Nuova password:</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={saving}>
            {saving ? "Salvataggio..." : "Salva Modifiche"}
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
    height: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
    marginTop: "1rem",
    marginBottom: "1rem"
  },
  popUpcard: {
    backgroundColor: "rgb(35, 35, 35)",
    color: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
    display: "block"
  },
  title: {
    color: "#4f46e5",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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
  label: {
    marginTop: "0.25rem",
    color: "#300818",
    fontWeight: "bold"
  }
};

export default ModificaPassword;
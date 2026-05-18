import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";




const ModificaPub = (props) => {
  const categories = ["Accessori", "Elettronica", "Documenti", "Chiavi", "Abbigliamento", "Borse e Zaini", "Animali", "Altro"];

  const { pubId } = useParams();
  const { token } = props;
  const [formData, setFormData] = useState({
    description: "",
    category: "altro",
    notes: "",
    image: "",
    date: "",
    type: "found",
    state: ""
  });

  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  
  useEffect(() => {
    const fetchPublication = async () => {
      if (!token || !pubId) return;
      
      try {
        const response = await fetch(`/api/v2/publications/${pubId}`, {
          headers: { 'x-access-token': token }
        });

        if (!response.ok) throw new Error("Errore nel recupero della pubblicazione.");
        
        const data = await response.json();
        
        setFormData({
          description: data.description,
          category: data.category,
          notes: data.notes,
          image: data.image,
          date:data.date.split('T')[0],
          type: data.type,
          state: data.state
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [pubId, token]);

  
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
        const response = await fetch(`/api/v2/publications/${pubId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
        },
        body: JSON.stringify(formData)
        });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        throw new Error(errorData.message || `Errore HTTP: ${response.status}`);
    }

  await response.json();

    setSuccessMsg("Pubblicazione aggiornata con successo!");  
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };


  if (!token) return <div style={styles.message}>Effettua il login per continuare.</div>;
  if (loading) return <div style={styles.message}>Caricamento dettagli...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Modifica Segnalazione</h2>

        {error && <div style={styles.errorBox}>{error}</div>}
        {successMsg && <div style={styles.successBox}>{successMsg}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Descrizione:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.input}
            rows="3"
            required
          />
          
          <label style={styles.label}>Categoria:</label>
          <select name="category" value={formData.category} onChange={handleChange} style={styles.input} required>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          
          <label style={styles.label}>Data evento:</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            style={styles.input} 
            required 
          />
          
          <label style={styles.label}>Tipo Segnalazione:</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input 
                type="radio" 
                name="type" 
                value="found" 
                checked={formData.type === "found"} 
                onChange={handleChange} 
              /> Ritrovato
            </label>
            <label style={styles.radioLabel}>
              <input 
                type="radio" 
                name="type" 
                value="lost" 
                checked={formData.type === "lost"} 
                onChange={handleChange} 
              /> Smarrito
            </label>
          </div>

            <label style={styles.label}>Stato della Segnalazione:</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
              <input 
                type="radio" 
                name="state" 
                value="unresolved" 
                checked={formData.state === "unresolved"} 
                onChange={handleChange} 
              /> Non risolto
            </label>
            <label style={styles.radioLabel}>
              <input 
                type="radio" 
                name="state" 
                value="solved" 
                checked={formData.state === "solved"} 
                onChange={handleChange} 
              /> Risolto
            </label>
            <label style={styles.radioLabel}>
              <input 
                type="radio" 
                name="state" 
                value="decayed" 
                checked={formData.state === "decayed"} 
                onChange={handleChange} 
              /> Decaduto
            </label>
          </div>



          
          <label style={styles.label}>Note Aggiuntive:</label>
          <input 
            type="text" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            style={styles.input} 
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
    height: "100vh",
    
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
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

export default ModificaPub;
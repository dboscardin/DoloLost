import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CreaAdmin = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const { token } = props;
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        if (!token) {
            setMessage({ text: 'Errore: Token di amministrazione mancante. Effettua il login.', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/v2/users/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.status === 201 && data.success) {
                setMessage({ text: `Successo: ${data.message}`, type: 'success' });
                setFormData({ name: '', surname: '', username: '', email: '', password: '' });
            } else {
                setMessage({ text: `Errore: ${data.error || 'Errore nella registrazione'}`, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Errore di rete o server non raggiungibile.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
        <div style={styles.card}>
            <h2 style={styles.title}>Registra Nuovo Amministratore</h2>

            {message.text && (
                <div style={styles.info}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                
                    <label style={styles.label}>Nome</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input}/>
             

                    <label style={styles.label}>Cognome</label>
                    <input type="text" name="surname" value={formData.surname} onChange={handleChange} required style={styles.input} />
                    
                    <label style={styles.label}>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required style={styles.input} />

                    <label style={styles.label}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input}/>

                    <label style={styles.label}>Password (min. 8 caratteri)</label>
                    <input type="password" name="password" minLength={8} value={formData.password} onChange={handleChange} required style={styles.input}/>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Elaborazione in corso...' : 'Crea Admin'}
                </button>
            </form>
        </div>
        </div>
    );
}
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
  evilButton: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#7f1111",
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
export default CreaAdmin;
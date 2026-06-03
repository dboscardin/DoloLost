import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Contatto = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { userId } = useParams(); 
    const navigate = useNavigate();
    
    const [utente, setUtente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDatiUtente = async () => {
            try {
               
                
                // rotta backend GET /api/v2/users/:id
                const response = await fetch(`${API_URL}/api/v2/users/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) throw new Error('Utente non trovato');
                    throw new Error('Errore nel recupero dei dati');
                }

                const data = await response.json();
                setUtente(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDatiUtente();
    }, [userId]);

    if (loading) return <div className="loading-message">Caricamento contatti in corso...</div>;
    if (error) return <div className="error-message">Errore: {error}</div>;
    if (!utente) return null;

    return (
        <div className="contatti-container" style={styles.container}>
            <div className="contatti-card" style={styles.card}>
                <h2 style={styles.title}>Informazioni di Contatto</h2>
                
                <div style={styles.infoGroup}>
                    <strong>Nome:</strong>
                    <span>{utente.name} {utente.surname}</span>
                </div>
                
                <div style={styles.infoGroup}>
                    <strong>Username:</strong>
                    <span>@{utente.username}</span>
                </div>
                
                <div style={styles.infoGroup}>
                    <strong>Email:</strong>
                    <a href={`mailto:${utente.email}`} style={styles.link}>
                        {utente.email}
                    </a>
                </div>

                <button onClick={() => navigate(-1)} style={styles.button}>
                    Torna Indietro
                </button>
            </div>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        padding: '20px'
    },
    card: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
    },
    title: {
        marginBottom: '20px',
        color: '#333'
    },
    infoGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #eee',
        fontSize: '16px'
    },
    link: {
        color: '#007BFF',
        textDecoration: 'none'
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%'
    }
};

export default Contatto;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';




const ListUsers = (props) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token2, setToken2] = useState(null)
    useEffect(() => {
        const loadData = async () => {
            try {
                const token = props.token; 
                if (!token) return;

                const response = await fetch(`${API_URL}/api/v2/users`, {
                    method: 'GET',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error("Sessione scaduta. Effettua di nuovo il login.");
                    }
                    throw new Error("Errore nel caricamento degli utenti.");
                }

                const data = await response.json();
                setToken2(token);
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [props.token]);

    if (loading) return <div className="text-center mt-5">Caricamento in corso...</div>;
    if (error) return <div className="alert alert-danger m-4">{error}</div>;

    const deleteUserByAdmin = async(userId) => {
    const conferma = window.confirm("Sei sicuro di voler eliminare definitivamente questo account?");
      if (!conferma) return;

      try {
        const response = await fetch(`/api/v2/users/${userId}`, {
          method: 'DELETE',
          headers: { 'x-access-token': token2,
            "Content-Type" : "text/plain"
          }
      });
   
        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Errore nell'eliminazione dell'account");
          return;
        }

        
        alert("Account eliminato con successo");

      } catch (error) {
        console.error("Errore nell'eliminazione dell'account:", error);
        alert("Errore di connessione col server");
      }
  }
    return (
       <div style={{ padding: '40px 20px' }}>
             <h2 className="text-center mb-5" style={{ color: '#4a4a4a', fontWeight: '300' }}>Utenti</h2>
             {
                users.length === 0 ? (<div className="text-center text-muted">Nessun Utente.</div>
                ) : (
                    <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '25px', maxWidth: '1200px', margin: '0 auto' 
        }}>
          {users.map((user) => (
            <div key={user._id} style={cardStyle}>
                <h4 style={{ margin: '10px 0 10px 0', fontSize: '16px', color: '#444' }}>@{user.username}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#444' }}>{user.name} {user.surname}</p>
                <p style={{ color: '#555', fontSize: '14px', flexGrow: 1 }}>{user.email}</p>
                <p style={{ margin: '0 0 1px 0', fontSize: '14px', color: '#555' }}>Ruolo: {user.role}</p>
               <button style= {btnStyle} onClick={() => deleteUserByAdmin(user._id)}>Cancella Utente</button>

              </div>
           
          ))}
        </div>
                )
             }            
       </div>
    
  
  
  );
};

const cardStyle = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' };
const imageStyle = { width: '100%', height: '220px', objectFit: 'cover' };
const badgeStyle = { padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
const btnStyle = { textDecoration: 'none', color: 'white', backgroundColor: '#1565c0', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', margin: 8 };
const placeholderStyle = { width: '100%', height: '220px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999' };
export default ListUsers;
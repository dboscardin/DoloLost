import { useState, useEffect } from 'react'
import {useCookies} from "react-cookie"
import './AdminHome'
import { Routes, Route, Link, useSearchParams } from 'react-router-dom'
import UserLogin from './UserLogin.jsx'
import UserSignUp from './UserSignUp.jsx'
import ModificaPub from './ModificaPub.jsx'
import Contatto from './Contatto.jsx'
import ModificaUser from './ModificaUser.jsx'
import ModificaPassword from './ModificaPassword.jsx'
import App from './App.jsx'

const categories = ["Accessori", "Elettronica", "Documenti", "Chiavi", "Abbigliamento", "Borse e Zaini", "Animali", "Altro"];

 const AdminPage = ({ publications, loading, filters, handleFilterChange, loadData }) => (
  <div style={{ padding: '40px 20px' }}>
    <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Bacheca Segnalazioni</h1>
    
    
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '30px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Cerca</label>
        <input name="description" placeholder="Es: portafoglio..." value={filters.description} onChange={handleFilterChange} style={inputStyle} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Categoria</label>
        <select name="category" value={filters.category} onChange={handleFilterChange} style={inputStyle}>
          <option value="">Tutte</option>
          {categories.map(cat => <option key={cat} value={cat.toLowerCase()}>{cat}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Tipo</label>
        <select name="type" value={filters.type} onChange={handleFilterChange} style={inputStyle}>
          <option value="">Entrambi</option>
          <option value="lost">Smarrito</option>
          <option value="found">Ritrovato</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Dal</label>
        <input type="date" name="date_from" value={filters.date_from} onChange={handleFilterChange} style={inputStyle} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Al</label>
        <input type="date" name="date_before" value={filters.date_before} onChange={handleFilterChange} style={inputStyle} />
      </div>

      <button onClick={loadData} style={{
        backgroundColor: '#1565c0', color: 'white', border: 'none', 
        padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
      }}>
        Filtra 🔍
      </button>
    </div>

    
    {loading ? (
      <h2 style={{ textAlign: 'center' }}>Caricamento in corso... ⏳</h2>
    ) : publications.length === 0 ? (
      <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Nessun risultato trovato con questi filtri.</p>
    ) : (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '25px', maxWidth: '1200px', margin: '0 auto' 
      }}>
        {publications.map((publication) => (
          <div key={publication._id} style={cardStyle}>
            {publication.image ? (
              <img src={publication.image} alt={publication.description} style={imageStyle} />
            ) : (
              <div style={placeholderStyle}>Nessuna immagine</div>
            )}

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{ ...badgeStyle, backgroundColor: publication.type === 'lost' ? '#ffebee' : '#e8f5e9', color: publication.type === 'lost' ? '#d32f2f' : '#2e7d32' }}>
                  {publication.type === 'lost' ? 'SMARRITO' : 'RITROVATO'}
                </span>
                <span style={{ ...badgeStyle, backgroundColor: '#e3f2fd', color: '#1565c0' }}>
                  {publication.category}
                </span>
              </div>

              <Link to={`/contatto/${publication.user._id}`}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>👤 {publication.user?.username || "Utente"}</h3>
                </Link>
              
              <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#444' }}>{publication.description}</h4>
              <p style={{ color: '#555', fontSize: '14px', flexGrow: 1 }}>{publication.notes}</p>
              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
              <div style={{ fontSize: '12px', color: '#888' }}>📅 {new Date(publication.date).toLocaleDateString('it-IT')}</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

function AdminHome() {

  const API_URL = import.meta.env.VITE_API_URL;
  const [cookies, setCookies, removeCookies] = useCookies(["userCookies"])
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [searchParams, setSearchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [filters, setFilters] = useState({
    description: '',
    category: '',
    type: '',
    date_from: '',
    date_before: ''
  });

  const loadData = () => {
    setLoading(true);
    
    // Rimuove i campi vuoti dai parametri per pulire l'URL
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    
    const queryString = new URLSearchParams(activeFilters).toString();
    
    fetch(`${API_URL}/api/v2/publications/attive?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        setPublications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore durante il fetch:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("APP cookies:", cookies);
    console.log("APP userCookies:", cookies.userCookies);
    console.log("APP role:", cookies.userCookies?.role);
    
    const urlParams = cookies.userCookies? cookies.userCookies: {token: false};
    const tokenParam = urlParams.token;

    console.log("tokenParam:", tokenParam);

    if (tokenParam) {
      setToken(tokenParam);
      setUserData({
        username: urlParams.username,
        name: urlParams.name,
        id: urlParams.id,
        role: urlParams.role
      });
    } else {
      setToken('');
      setUserData(null);
    }

    loadData();
  }, [cookies]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const logout = () => {

    removeCookies("userCookies") 
    setToken(null);
    setUserData(null);
    
    window.location.href = "/userLogin";
  };

  const deleteUserByAdmin = async(userId) => {
    const conferma = window.confirm("Sei sicura di voler eliminare definitivamente questo account?");
      if (!conferma) return;

      try {
        const response = await fetch(`${API_URL}/api/v2/users/${userId}`, {
          method: 'DELETE',
          headers: { 'x-access-token': token }
      });
   
        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Errore nell'eliminazione dell'account");
          return;
        }

        logout();
        alert("Account eliminato con successo");

      } catch (error) {
        console.error("Errore nell'eliminazione dell'account:", error);
        alert("Errore di connessione col server");
      }
  }

  return (

    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
          
      <Routes>
         <Route path="/" element={
            userData?.role ==="admin" ? <AdminPage
              publications={publications}
              loading={loading}
              filters={filters}
              handleFilterChange={handleFilterChange}
              loadData={loadData}
              token={token}
            /> : <App
              publications={publications}
              loading={loading}
              filters={filters}
              handleFilterChange={handleFilterChange}
              loadData={loadData}
              token={token}
            />
          }
        />
         
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/userSignUp" element={<UserSignUp />} />
        <Route path="/modificaPub/:pubId" element={<ModificaPub token={token} />} />
        <Route path="/modificaUser/:userId" element={<ModificaUser token={token} />} />
        <Route path="/modificaPassword/:userId" element={<ModificaPassword token={token} />} />
        <Route path="/contatto/:userId" element={<Contatto />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="*" element={<div>Pagina non trovata</div>} />
        

      </Routes>
    </div>
  )
}

const inputStyle = { padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' };
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' };
const imageStyle = { width: '100%', height: '220px', objectFit: 'cover' };
const placeholderStyle = { width: '100%', height: '220px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' };
const badgeStyle = { padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
//const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 };
//const btnStyle = { textDecoration: 'none', color: 'white', backgroundColor: '#1565c0', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', margin: 8 };


export default AdminHome
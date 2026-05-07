import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import { useSearchParams } from "react-router-dom";
import UserLogin from './UserLogin.jsx'


function App() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  

  useEffect(() => {
    fetch('/api/v1/publications/attive')
      .then((response) => response.json())
      .then((data) => {
        
        setPublications(data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore durante il fetch:", error);
        setLoading(false);
      });
  }, []);

  

  const autenticato = searchParams.get("username");
  const role = searchParams.get("role");
  const name = searchParams.get("name");
  const token = searchParams.get("token");

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento in corso... ⏳</h2>;
  }
  const HomePage = () => (
    <div style={{ padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Bacheca Segnalazioni</h1>
      
      {publications.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Il database è vuoto.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '25px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {publications.map((publication) => (
            <div key={publication._id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              
              {publication.image ? (
                <img 
                  src={publication.image} 
                  alt={publication.description} 
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '220px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                  Nessuna immagine
                </div>
              )}

              {/* Contenuto della Card */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                
                {/* Badge Type e Category */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    backgroundColor: publication.type === 'lost' ? '#ffebee' : '#e8f5e9',
                    color: publication.type === 'lost' ? '#d32f2f' : '#2e7d32'
                  }}>
                    {publication.type === 'lost' ? 'SMARRITO' : 'RITROVATO'}
                  </span>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    backgroundColor: '#e3f2fd',
                    color: '#1565c0'
                  }}>
                    {publication.category}
                  </span>
                </div>
                  
                  <h3 style={{ margin: '0 0 10px 0', color: '#222', fontSize: '20px' }}>
                  {publication.user.username}
                </h3>

                <h4 style={{ margin: '0 0 10px 0', color: '#222', fontSize: '20px' }}>
                  {publication.description}
                </h4>
                
                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5', flexGrow: 1 }}>
                  {publication.notes}
                </p>
                
                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
                
                <div style={{ fontSize: '12px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📅 {new Date(publication.date).toLocaleDateString('it-IT')}</span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>


      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
       
      }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#1565c0' }}>
          DoloLost
          
        </div>
        <div>
        {!autenticato ? (
          //link se non autenticato (login e registra)
          <Link to="/userLogin" style={{
            textDecoration: 'none',
            color: 'white',
            backgroundColor: '#1565c0',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}>
            Login
          </Link>
        
        ) : "Benvenuto " + name}
        </div>
      </nav>

          <Routes>
         {// ricordarsi di prendere i paramentri con searchParams.get("XXX") per passarli alle routes
         }
        <Route path="/" element={<HomePage />} />
        <Route path="/userLogin" element={<UserLogin />} />
      </Routes>


      
    </div>
  )
}

export default App
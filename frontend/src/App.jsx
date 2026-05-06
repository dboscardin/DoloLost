import { useState, useEffect } from 'react'
import './App.css'

<<<<<<< HEAD
function App() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
=======
import { useState, useEffect } from 'react'
import pub from '../../backend/app/models/pub'

function App() {
  const [publications, setPublications] = useState([]); // Array per pubs
  const [loading, setLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    // http://localhost:8080/api/v1/pubs
>>>>>>> c272f29515dc6284461ed3bfd37e9506e3f34b32
    fetch('/api/v1/publications')
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

  if (loading) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento in corso... ⏳</h2>;
  }

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Bacheca Segnalazioni</h1>
      
      {publications.length === 0 ? (
<<<<<<< HEAD
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
              
              {/* Gestione Immagine Base64 intelligente */}
              {publication.image ? (
                <img 
                  src={publication.image.startsWith('data:') ? publication.image : `data:image/jpeg;base64,${publication.image}`} 
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
                  {publication.description}
                </h3>
                
                <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5', flexGrow: 1 }}>
                  {publication.notes}
                </p>
                
                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
                
                <div style={{ fontSize: '12px', color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📅 {new Date(publication.date).toLocaleDateString('it-IT')}</span>
                </div>

              </div>
            </div>
=======
        <p>Il database è vuoto.</p>
      ) : (
        <ul>
          {publications.map((publication) => (
            <li key={publication._id} style={{ margin: '10px 0', fontSize: '18px' }}>
              <h4>{publication.description}</h4>
              {publication.category}
              {publication.notes}
              {publication.date}
              {publication.type}
              {publication.image && (
              <img 
                src={publication.image} 
                
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
              />
            )}
            </li>
>>>>>>> c272f29515dc6284461ed3bfd37e9506e3f34b32
          ))}
        </div>
      )}
    </div>
  )
}

export default App
import React, { useEffect, useState } from 'react';

const PropriePub = (props) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = props.token; 
                if (!token) return;

                const response = await fetch('/api/v1/publications/proprie', {
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
                    throw new Error("Errore nel caricamento delle pubblicazioni.");
                }

                const data = await response.json();
                setPublications(data);
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

    return (
       <div style={{ padding: '40px 20px' }}>
             <h2 className="text-center mb-5" style={{ color: '#4a4a4a', fontWeight: '300' }}>Le Mie Pubblicazioni</h2>
             {
                publications.length === 0 ? (<div className="text-center text-muted">Non hai ancora creato nessuna pubblicazione.</div>
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
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#444' }}>{publication.description}</h4>
                <p style={{ color: '#555', fontSize: '14px', flexGrow: 1 }}>{publication.notes}</p>
                <button style={btnStyle}>Dettagli</button>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
                <div style={{ fontSize: '12px', color: '#888' }}>📅 {new Date(publication.date).toLocaleDateString('it-IT')}</div>
              </div>
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
export default PropriePub;
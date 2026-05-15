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
        <div className="container mt-5">
            <h2 className="text-center mb-5" style={{ color: '#4a4a4a', fontWeight: '300' }}>Le Mie Pubblicazioni</h2>
            
            {publications.length === 0 ? (
                <div className="text-center text-muted">Non hai ancora creato nessuna pubblicazione.</div>
            ) : (
                <div className="row justify-content-center">
                    {publications.map((pub) => (
                        <div key={pub._id} className="col-12 col-md-8 col-lg-6 mb-5">
                            {/* Card pulita senza bordi pesanti */}
                            <div className="card border-0 text-center" style={{ backgroundColor: 'transparent' }}>
                                
                                {/* Immagine con angoli arrotondati e ombra leggera */}
                                {pub.image && (
                                    <div className="mb-3 d-flex justify-content-center">
                                        <img 
                                            src={pub.image} 
                                            alt={pub.category} 
                                            style={{
                                                width: '100%',
                                                maxWidth: '500px',
                                                height: '300px', 
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }} 
                                        />
                                    </div>
                                )}

                                <div className="card-body p-0">
                                    {/* Categoria in grigio (stile Home) */}
                                    <p className="text-muted text-uppercase small mb-2" style={{ letterSpacing: '1px' }}>
                                        {pub.category}
                                    </p>

                                    {/* Status con pallino colorato */}
                                    <div className="mb-2">
                                        {pub.type === 'lost' ? (
                                            <span><span style={{color: '#dc3545'}}>●</span> Smarrito</span>
                                        ) : (
                                            <span><span style={{color: '#28a745'}}>●</span> Ritrovato</span>
                                        )}
                                    </div>

                                    {/* Titolo/Descrizione principale */}
                                    <h4 className="card-title mb-1" style={{ color: '#555' }}>{pub.description}</h4>
                                    
                                    {/* Data formattata leggermente */}
                                    <p className="text-muted mb-3">
                                        Data: {new Date(pub.date).toLocaleDateString('it-IT')}
                                    </p>

                                    {/* Badge di Stato (Attivo/Risolto) */}
                                    <div className="mb-3">
                                        <span className={`badge rounded-pill ${pub.state === 'resolved' ? 'bg-success' : 'bg-secondary'}`} style={{ padding: '8px 15px' }}>
                                            {pub.state === 'resolved' ? 'Risolto' : 'Attivo'}
                                        </span>
                                    </div>

                                    {/* Pulsante Dettagli stile DoloLost */}
                                    <button className="btn btn-dark px-4 py-2" style={{ borderRadius: '5px' }}>
                                        Dettagli
                                    </button>
                                </div>
                            </div>
                            {/* Separatore orizzontale opzionale tra card */}
                            <hr className="mt-5 w-50 mx-auto" style={{ opacity: '0.1' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropriePub;
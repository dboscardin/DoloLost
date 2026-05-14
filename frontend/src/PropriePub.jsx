import React, { useEffect, useState } from 'react';

const PropriePub = (props) => {
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                
                const token = props.token; 
                
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
        <div className="container mt-4">
            <h2 className="mb-4">Le Mie Pubblicazioni</h2>
            {publications.length === 0 ? (
                <p>Non hai ancora creato nessuna pubblicazione.</p>
            ) : (
                <div className="row">
                    {publications.map((pub) => (
                        <div key={pub._id} className="col-md-4 mb-4">
                            <div className={`card h-100 ${pub.state === 'resolved' ? 'border-success' : 'border-primary'}`}>
                                {pub.image && (
                                    <img src={pub.image} className="card-img-top" alt={pub.category} style={{height: '200px', objectFit: 'cover'}} />
                                )}
                                <div className="card-body">
                                    <span className="badge bg-secondary mb-2">{pub.category}</span>
                                    <h5 className="card-title">{pub.type === 'lost' ? '🔴 Smarrito' : '🟢 Ritrovato'}</h5>
                                    <p className="card-text">{pub.description}</p>
                                    <p className="text-muted small">Data: {new Date(pub.date).toLocaleDateString()}</p>
                                </div>
                                <div className="card-footer d-flex justify-content-between">
                                    <button className="btn btn-sm btn-outline-info">Dettagli</button>
                                    <span className={`text-${pub.state === 'resolved' ? 'success' : 'warning'}`}>
                                        {pub.state === 'resolved' ? 'Risolto' : 'Attivo'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropriePub;
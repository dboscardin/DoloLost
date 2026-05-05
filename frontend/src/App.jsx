
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { useState, useEffect } from 'react'
import pub from '../../backend/app/models/pub'

function App() {
  const [pubs, setPubs] = useState([]); // Array per pubs
  const [loading, setLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    // http://localhost:8080/api/v1/pubs
    fetch('/api/v1/pubs')
      .then((response) => response.json())
      .then((data) => {
        setPubs(data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Errore durante il fetch:", error);
        setLoading(false);
      });
  }, []); // L'array vuoto fa eseguire la fetch solo all'apertura della pagina

  // Mostra un testo finché i dati non arrivano dal database
  if (loading) {
    return <h2>Caricamento in corso...</h2>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {pubs.length === 0 ? (
        <p>Il database è vuoto.</p>
      ) : (
        <ul>
          {pubs.map((pubs) => (
            <li key={pub._id} style={{ margin: '10px 0', fontSize: '18px' }}>
              <h4>{pub.description}</h4>
              {pub.category}
              {pub.notes}
              {pub.date}
              {pub.type}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App

import React, { useState, useEffect, useRef} from "react";
import {MapContainer, TileLayer, useMap, useMapEvents, Marker} from "react-leaflet"
//import "./leaflet.css"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
//import bcrypt from "bcryptjs";

//Sleep per facilitare lo spostamento del marker sulla mappa
async function sleep(ms){
  await new Promise((resolve) => setTimeout(resolve, ms))
}

const CreaPub = (props) => {
  L.Icon.Default.imagePath = "/leaflet-images/"
  const position = useRef({"lat": 46.06661, "lng": 11.12628})
  const categories = ["accessori", "elettronica", "documenti", "chiavi", "abbigliamento", "borse e zaini", "animali", "altro"];
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("altro")
  const [notes, setNotes] = useState("")
  const [imageFile, setImageFile] = useState(null);
  const [date, setDate] = useState((new Date()).getFullYear() + "-" + String((new Date()).getMonth() + 1).padStart(2,0) + "-" + String((new Date()).getDate()).padStart(2,0))
  const [type, setType] = useState("found")
  const [errText, setErrText] = useState("")
  const [location, setLocation] = useState("")
  const API_URL = import.meta.env.VITE_API_URL;

  //Trovare posizione di un indirizzo
  

  const LocationMarker = () => {
    const [marker, setMarker] = useState(position.current)
    const map = useMap()

    useEffect(() => {
      map.locate().on("locationfound", async (e) => {
        position.current = e.latlng
        map.setView(position.current, map.getZoom())
        await sleep(150)
        setMarker(map.getCenter())
      })

      map.on("click", async (e) => {
        position.current = e.latlng
        map.setView(position.current, map.getZoom())
        await sleep(150)
        setMarker(map.getCenter())
      })

    }, [map])

    useEffect(() => {
      if(location.trim() == ""){ return }
      const locationQuery = encodeURIComponent(location + ", Trento").replaceAll("%20", "+")
      const timeoutId = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?q=${locationQuery}&format=geojson&limit=1&layer=address,poi`, {
          method: "GET",
          headers: {
            "Content-Type": "text/plain"
          }
        }).then((res) => {
          return res.json()

        }).then((data) => {
          console.log(data)
          let coords = data.features[0].geometry.coordinates
          position.current.lat = coords[1]
          position.current.lng = coords[0]
          map.setView(position.current, map.getZoom())
          setMarker(map.getCenter())
        }).catch(() => {
          return
        })
      }, 600)

      return (() => {
        clearTimeout(timeoutId)
      })

    }, [location])

    return marker === null ? null : (
      <Marker position={marker}></Marker>
    )

  }

  const sendInfo = async (e) => {
    e.preventDefault()
    console.log(position.current)
   // console.log("submit partito");
    setErrText("");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("category", category);
    formData.append("notes", notes);
    formData.append("date", date);
    formData.append("type", type);

    //OTTENERE INDIRIZZO DA COORDINATE
    await fetch(`https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${position.current.lat}&lon=${position.current.lng}&zoom=18&layer=address,poi,manmade`,{
      method: "GET",
      headers: {
        "Content-Type" : "text/plain"
      }
    }).then((res) => {
      return res.json()
    }).then((data) =>{
      console.log(data)
      let addr = data.features[0].properties.geocoding["label"]
      formData.append("address", addr)
      formData.append("lat", position.current.lat)
      formData.append("lng", position.current.lng)
    }).catch((err) => {
      console.log(err)
      setErrText("Errore selezione indirizzo, attendere e riprovare")
    })
    if (errText != ""){return}

    if(imageFile) {
      formData.append("image", imageFile);
    }

    try {
     // console.log("sto inviando");
      //console.log("TOKEN:", props.token);
      const response = await fetch(`${API_URL}/api/v2/publications`, {
      method: "POST",
      headers: { 'x-access-token': props.token },
      body: formData
    });

 //   console.log("status:", response.status);

    const data = await response.json();
    //console.log("risposta backend:", data);

    if (!response.ok || !data.success) {
      setErrText(data.error || data.message || data.details || "Errore nella creazione pubblicazione");
      return;
    }
    window.location.href="/"
    } catch (error) {
     // console.error("errore fetch:", error);
      setErrText("Errore di rete o server non raggiungibile");
    }
  }


  if(!props.token){
    return(
      <p>Sessione Scaduta. Effettua di nuovo il login.</p>
    )
  }
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Creazione Pubblicazione</h2>
        <p style={styles.info}>{errText}</p>
        <form onSubmit={sendInfo} style={styles.form}>
          <label htmlFor="description" style={styles.label}>Descrizione:</label>
          <input
            id="description"
            value = {description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
            placeholder="Inserisci testo..."
            required
          />
          <label htmlFor="categoria" style={styles.label}>Categoria:</label>
          <select id="categoria" value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} required>
            {categories.map(c => <option key={c} value={c} style={{textAlign: "center"}}>{c.toUpperCase()}</option>)}
          </select>
          <label htmlFor="data" style={styles.label}>Data segnalazione:</label>
          <input id="data" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input}></input>
          <label style={styles.label}>Tipo Segnalazione:</label>
          
          <div className="radioDiv">
            <input id="typeTrovato" type="radio" name="type" value="found" onChange={(e) => setType(e.target.value)} style={styles.input} required></input> <label htmlFor="typeTrovato">trovato</label>
          </div>

          <div className="radioDiv">
            <input id="typePerduto" type="radio" name="type" value="lost" onChange={(e) => setType(e.target.value)} style={styles.input} required></input> <label htmlFor="typePerduto">perduto</label>
          </div>

          <label style={styles.label}>Note Aggiuntive (opzionale): </label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Inserisci testo..." style={styles.input}></input>
          <label style={styles.label}>Immagine (opzionale):</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)}></input>
          <input type="text" placeholder="Località o Indirizzo" onChange={(e) => setLocation(e.target.value)}></input>
          <MapContainer center={[46.06661,11.12628]} zoom={17} scrollWheelZoom={true} style={{height: "180px"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <LocationMarker></LocationMarker>
          </MapContainer>
          <button type="submit" style={styles.button}>
            Crea
          </button>
        </form>
      </div>
    </div>

  )
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    //backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
    marginBottom: "1rem",
    marginTop: "1rem"
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
  label: {
    marginTop: "0.25rem",
    color: "#300818",
    fontWeight: "bold"
  },
  info: {
    marginBottom: "0.75rem"
  }
};

export default CreaPub;
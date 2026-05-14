import React, { useState/*, useEffect*/} from "react";
//import bcrypt from "bcryptjs";

const CreaPub = (props) => {
  const categories = ["accessori", "elettronica", "documenti", "chiavi", "abbigliamento", "borse e zaini", "animali", , "altro"];
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("altro")
  const [notes, setNotes] = useState("")
  //const [image, setImage] = useState("");
  const [date, setDate] = useState((new Date()).getFullYear() + "-" + String((new Date()).getMonth() + 1).padStart(2,0) + "-" + String((new Date()).getDate()).padStart(2,0))
  const [type, setType] = useState("found")

  const sendInfo = (e) => {
    e.preventDefault()
    console.log(description, category, notes, date, type)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Creazione Pubblicazione</h2>
        <form onSubmit={sendInfo} style={styles.form}>
          <label htmlFor="description" style={styles.label}>Descrizione:</label>
          <textarea
            id="description"
            value = {description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
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
            <input id="typeTrovato" type="radio" name="type" value="found" onChange={(e) => setType(e.target.value)} style={styles.input} checked></input> <label htmlFor="typeTrovato" style={styles.label}>trovato</label>
             
          </div>
          <div className="radioDiv">
            <input id="typePerduto" type="radio" name="type" value="lost" onChange={(e) => setType(e.target.value)} style={styles.input}></input> <label htmlFor="typePerduto" style={styles.label}>perduto</label>
          </div>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Note aggiuntive" style={styles.input}></input>
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
    height: "100vh",
    //backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
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
  }
};

export default CreaPub;
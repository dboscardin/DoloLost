import dotenv from 'dotenv';
dotenv.config({ path: './app/.env' });
import mongoose from 'mongoose';
import User from '../app/models/user.js';
import Publication from '../app/models/publication.js';
 
const seedUsers = [
  {
    username: 'alice01',
    password: 'alice2026',
    email: 'alice01@gmail.com',
    name: 'Alice',
    surname: 'Rossi',
    role: 'user'
  },
  {
    username: 'bruno02',
    password: 'bruno2026',
    email: 'bruno02@gmail.com',
    name: 'Bruno',
    surname: 'Bianchi',
    role: 'user'
  },
  {
    username: 'chiara03',
    password: 'chiara03',
    email: 'chiara03@gmail.com',
    name: 'Chiara',
    surname: 'Verdi',
    role: 'user'
  },
  {
    username: 'davide04',
    password: 'davide04',
    email: 'davide04@gmail.com',
    name: 'Davide',
    surname: 'Neri',
    role: 'user'
  },
  {
    username: 'elena05',
    password: 'elena2026',
    email: 'elena05@gmail.com',
    name: 'Elena',
    surname: 'Fontana',
    role: 'user'
  },
  {
    username: 'fabio06',
    password: 'fabio2026',
    email: 'fabio06@gmail.com',
    name: 'Fabio',
    surname: 'Galli',
    role: 'user'
  },
  {
    username: 'giulia07',
    password: 'giulia07',
    email: 'giulia07@gmail.com',
    name: 'Giulia',
    surname: 'Costa',
    role: 'user'
  },
  {
    username: 'luca08',
    password: 'luca20268',
    email: 'luca08@gmail.com',
    name: 'Luca',
    surname: 'Greco',
    role: 'user'
  },
  {
    username: 'marta09',
    password: 'marta2026',
    email: 'marta09@gmail.com',
    name: 'Marta',
    surname: 'Romano',
    role: 'user'
  },
  {
    username: 'nicola10',
    password: 'nicola10',
    email: 'nicola10@gmail.com',
    name: 'Nicola',
    surname: 'Barbieri',
    role: 'user'
  },
  {
    username: 'paola11',
    password: 'paola2026',
    email: 'paola11@gmail.com',
    name: 'Paola',
    surname: 'Ferrari',
    role: 'user'
  },
  {
    username: 'riccardo12',
    password: 'riccardo12',
    email: 'riccardo12@gmail.com',
    name: 'Riccardo',
    surname: 'Moretti',
    role: 'user'
  },
  {
    username: 'sara13',
    password: 'sara202613',
    email: 'sara13@gmail.com',
    name: 'Sara',
    surname: 'Marini',
    role: 'user'
  },
  {
    username: 'tommaso14',
    password: 'tommaso14',
    email: 'tommaso14@gmail.com',
    name: 'Tommaso',
    surname: 'Conti',
    role: 'user'
  },
  {
    username: 'valeria15',
    password: 'valeria15',
    email: 'valeria15@gmail.com',
    name: 'Valeria',
    surname: 'DeLuca',
    role: 'user'
  },
  {
    username: 'marti.m',
    password: 'primavera',
    email: 'martina.m@gmail.com',
    name: 'Martina',
    surname: 'Martini',
    role: 'user'
  },
  {
    username: 'admin01',
    password: 'adminpass1',
    email: null,
    name: 'Laura',
    surname: 'Supervisori',
    role: 'admin'
  },
  {
    username: 'admin02',
    password: 'adminpass2',
    email: null,
    name: 'Laura',
    surname: 'Supervisori',
    role: 'admin'
  },
  {
    username: 'admin03',
    password: 'adminpass3',
    email: null,
    name: 'Andrea',
    surname: 'Root',
    role: 'admin'
  },
];

const seedPublications = (users) => [
  {
    description: 'Portafoglio nero smarrito vicino alla stazione',
    category: 'accessori',
    notes: 'Conteneva documenti e una tessera universitaria',
    image: 'https://www.latigredicarta.it/wp-content/uploads/2019/11/Pokemon-1.jpg',
    date: new Date('2026-04-01'),
    location: {
      type: 'Point',
      coordinates: [11.0395, 45.8902],
      address: 'Stazione ferroviaria di Trento, Piazza Dante, 38122 Trento TN'
    },
    state: 'unresolved',
    type: 'lost',
    user: users[0]._id
  },
  {
    description: 'Mazzo di chiavi trovato in Piazza Rosmini',
    category: 'chiavi',
    notes: 'Portachiavi rosso',
    image: 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/133.png',
    date: new Date('2026-04-02'),
    location: {
      type: 'Point',
      coordinates: [11.0388, 45.8869],
      address: 'Piazza Rosmini, Trento, TN'
    },
    state: 'unresolved',
    type: 'found',
    user: users[1]._id
  }
  /*, {
    descrizione: 'Zaino blu smarrito su un autobus urbano',
    categoria: 'borse',
    note: null,
    immagine: 'https://example.com/images/zaino.jpg',
    data: new Date('2026-04-03'),
    location: {
      type: 'Point',
      coordinates: [11.0412, 45.8884],
      address: 'Via Verdi 8, 38122 Trento TN'
    },
    state: 'solved',
    type: 'lost',
    user: users[2]._id
  },
  {
    descrizione: 'Telefono trovato al parco',
    categoria: 'elettronica',
    note: 'Schermo leggermente graffiato',
    immagine: 'https://example.com/images/telefono.jpg',
    data: new Date('2026-04-04'),
    location: {
      type: 'Point',
      coordinates: [11.0425, 45.8898],
      address: 'Parco di Piazza Dante, 38122 Trento TN'
    },
    state: 'unresolved',
    type: 'found',
    user: users[3]._id
  },
  {
    descrizione: 'Ombrello nero smarrito in biblioteca',
    categoria: 'accessori',
    note: null,
    immagine: 'https://example.com/images/ombrello.jpg',
    data: new Date('2026-03-05'),
    location: {
      type: 'Point',
      coordinates: [11.0379, 45.8875],
      address: 'Biblioteca Universitaria, Via Verdi 8, 38122 Trento TN'
    },
    state: 'decayed',
    type: 'lost',
    user: users[4]._id
  },
  {
    descrizione: 'Carta d’identità trovata vicino al municipio',
    categoria: 'documenti',
    note: null,
    immagine: 'https://example.com/images/documento.jpg',
    data: new Date('2026-04-06'),
    location: {
      type: 'Point',
      coordinates: [11.0399, 45.8871],
      address: 'Castello del Buonconsiglio, Via Bernardo Clesio 5, 38122 Trento TN'
    },
    state: 'unresolved',
    type: 'found',
    user: users[5]._id
  },
  {
    descrizione: 'Auricolari wireless smarriti al bar',
    categoria: 'elettronica',
    note: 'Custodia bianca',
    immagine: 'https://example.com/images/auricolari.jpg',
    data: new Date('2026-04-07'),
    location: {
      type: 'Point',
      coordinates: [11.0408, 45.8891],
      address: 'Castello del Buonconsiglio, Via Bernardo Clesio 5, 38122 Trento TN'
    },
    state: 'solved',
    type: 'lost',
    user: users[6]._id
  },
  {
    descrizione: 'Borraccia metallica trovata al campo sportivo',
    categoria: 'oggetti personali',
    note: null,
    immagine: 'https://example.com/images/borraccia.jpg',
    data: new Date('2026-04-08'),
    location: {
      type: 'Point',
      coordinates: [11.0441, 45.8913],
      address: 'Campo sportivo Quercia, Via Palestrina, 38068 Rovereto TN'
    },
    state: 'unresolved',
    type: 'found',
    user: users[7]._id
  },
  {
    descrizione: 'Giacca grigia smarrita in università',
    categoria: 'abbigliamento',
    note: 'Taglia M, dipartimento di lettere',
    immagine: 'https://example.com/images/giacca.jpg',
    data: new Date('2026-04-09'),
    location: {
      type: 'Point',
      coordinates: [11.0367, 45.8888],
      address: 'Via Rosmini, 38122 Trento TN',
    },
    state: 'unresolved',
    type: 'lost',
    user: users[8]._id
  },
  {
    descrizione: 'Braccialetto trovato in centro storico',
    categoria: 'gioielli',
    note: 'Color argento',
    immagine: 'https://example.com/images/braccialetto.jpg',
    data: new Date('2026-04-10'),
    location: {
      type: 'Point',
      coordinates: [11.0381, 45.8864],
      address: 'Piazza Fiera, 38122 Trento TN'
    }
  }*/
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connesso al DB');

        await User.deleteMany({});
        await Publication.deleteMany({});

        const insertedUsers = await User.insertMany(seedUsers);
        const publications = seedPublications(insertedUsers);
        await Publication.insertMany(publications);

        console.log('Inseriti utenti e pubblicazioni');
    } catch (error) {
        console.error('Errore seed: ', error);
    } finally {
        await mongoose.connection.close();
        console.log('Connessione chiusa');
    }
}

await seedDB();

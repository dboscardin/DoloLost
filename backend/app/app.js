import express from 'express';

import userRouter from './routes/v1/users.js'
import publicationRouter from './routes/v1/publications.js'
import authentication from './routes/v1/authentication.js'

import userRouter2 from './routes/v2/users.js'
import publicationRouter2 from './routes/v2/publications.js'
import authentication2 from './routes/v2/authentication.js'

import swaggerUi from 'swagger-ui-express';
import Path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

import cors from 'cors';


const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const swaggerDocument = yaml.load(readFileSync(Path.join(__dirname, '..', '..', 'oas3.yaml'), 'utf8'));


const app = express();

app.use(cors({
  origin: [
    'https://dololost.onrender.com',
    'http://localhost:5173'
  ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('DoloLost backend attivo');
});

//in secondo sprint saranno v2
app.use('/api/v1/publications', publicationRouter);
app.use('/api/v1/auth', authentication);
app.use('/api/v1/users', userRouter);

app.use('/api/v2/publications', publicationRouter2);
app.use('/api/v2/auth', authentication2);
app.use('/api/v2/users', userRouter2);

export default app;


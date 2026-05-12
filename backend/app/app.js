import express from 'express';

import userRouter from './routes/users.js'
import publicationRouter from './routes/publications.js'
import authentication from './routes/authentication.js'
import swaggerUi from 'swagger-ui-express';
import Path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';


const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const swaggerDocument = yaml.load(readFileSync(Path.join(__dirname, '..', '..', 'oas3.yaml'), 'utf8'));


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('DoloLost backend attivo');
});

//in secondo sprint saranno v2
app.use('/api/v1/publications', publicationRouter);
app.use('/api/v1/auth', authentication);



//da qua in poi le route sono autenticate


//da qua in poi le route sono admin
app.use('/api/v1/users', userRouter);


export default app;


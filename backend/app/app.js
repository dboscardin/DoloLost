import express from 'express';

import userRouter from './routes/users.js'
import publicationRouter from './routes/publications.js'
import authentication from './authentication.js'
import tokenChecker from './tokenChecker.js'
import adminChecker from './adminChecker.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('DoloLost backend attivo');
});

//in secondo sprint saranno v2
app.use('/api/v1/publications', publicationRouter);
app.use('/api/v1/authentications', authentication);


app.use(tokenChecker);
//da qua in poi le route sono autenticate


app.use(adminChecker);
//da qua in poi le route sono admin
app.use('/api/v1/users', userRouter);


export default app;


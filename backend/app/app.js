import express from 'express';

import userRouter from './routes/users.js'
import publicationRouter from './routes/publications.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('DoloLost backend attivo');
});

//in secondo sprint saranno v2
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/publications', publicationRouter);

export default app;


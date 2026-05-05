import express from 'express';

import userRouter from './routes/users.js'
import pubRouter from './routes/pubs.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('DoloLost backend attivo');
});

//in secondo sprint saranno v2
app.use('/api/v1/users', userRouter);
app.use('/api/v1/pubs', pubRouter);

export default app;


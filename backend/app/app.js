import express from 'express';

import userRouter from './routes/users.js'
import publicationRouter from './routes/publications.js'
import authentication from './routes/authentication.js'
import tokenChecker from './middleware/tokenChecker.js'
import adminChecker from './middleware/adminChecker.js'
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('DoloLost backend attivo');
});

//in secondo sprint saranno v2
app.use('/api/v1/publications', publicationRouter);
app.use('/api/v1/auth', authentication);


//app.use(tokenChecker);
//app.use(adminChecker);

app.use('/api/v1/users', userRouter);


export default app;


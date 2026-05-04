import express from 'express';

const app = express();


import userRouter from './users.js'
import pubRouter from './pubs.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/users', userRouter);
app.use('/api/v1/pubs', pubRouter);


export default app;


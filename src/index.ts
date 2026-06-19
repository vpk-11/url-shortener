import 'dotenv/config';
import express from 'express';
import path from 'path';
import connectDB from './config/db';
import indexRouter from './routes/index';
import urlRouter from './routes/url';

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/api/url', urlRouter);

const PORT = process.env.PORT ?? '5000';

app.listen(Number(PORT), () => console.log(`Server running on port ${PORT}`));

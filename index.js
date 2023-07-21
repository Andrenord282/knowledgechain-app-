const express = require('express');
const mongoose = require('mongoose');
// const dotenv = require('dotenv');
require('dotenv').config();
const cors = require('cors');
const configCros = require('./config/configCros');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRouter = require('./routers/authRouter');
const postRouter = require('./routers/postRouter');
const searchRouter = require('./routers/searchRouter');

// import postRouter from './routers/postRouter.js';
// import authRouter from './routers/authRouter.js';

// dotenv.config();
const app = express();
app.use(cors(configCros));
// app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/search', searchRouter);
app.use('/post', postRouter);
app.use(errorMiddleware);

app.use(express.static('public'));
// app.use(express.static(`public`));
// // app.use('/', postRouter, searchRouter);

const run = async () => {
    try {
        const PORT = process.env.PORT || 4000;
        const DB_HOST = process.env.DB_HOST;

        const mongooseSet = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        };

        mongoose.set('strictQuery', false);
        mongoose.connect(DB_HOST, mongooseSet);

        app.listen(PORT, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`Слушатель работает, порт: ${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

run();

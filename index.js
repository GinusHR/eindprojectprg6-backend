import express from 'express';
import mongoose from "mongoose";
import transformers from "./routes/transformers.js";

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/transformers');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-type, Authorization, Accept');
    next()
});

app.use((req,res,next) => {
    if (req.method !== 'OPTIONS' && req.headers.accept !=='application/json'){
        return res.status(406).json({error: 'Request are only acceptable with Accept: json'});
    }
    next();

});

app.use('/transformers', transformers);

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening to port: ${process.env.EXPRESS_PORT}`);
});
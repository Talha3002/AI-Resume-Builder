const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/route');
const PORT = 5000;

const app = express();

mongoose
    .connect('mongodb://localhost:27017/resume')
    .then(() => console.log('DB Connected'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/api', userRoute);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

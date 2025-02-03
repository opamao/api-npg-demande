const express = require('express');
const app = express();
const userRoute = require('./src/routes/userRoute');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const port = 3000

dotenv.config()

app.use(bodyParser.json())

app.use('/api/users', userRoute)

app.listen(port, () => {
    console.log('Votre application utilise le port ' + port)
})
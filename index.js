const express = require('express');
const app = express();
const userRoute = require('./src/routes/userRoute');
const roleRoute = require('./src/routes/roleRoute');
const permissionRoute = require('./src/routes/permissionRoute');
const paysRoute = require('./src/routes/paysRoute');
const demandeGadgetRoute = require('./src/routes/demandeGadgetRoute');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const port = 3000

dotenv.config()

app.use(bodyParser.json())

app.use('/api/users', userRoute)

app.use('/api/roles', roleRoute)
app.use('/api/permissions', permissionRoute)

app.use('/api/pays', paysRoute)

app.use('/api/gadget', demandeGadgetRoute)

app.listen(port, () => {
    console.log('Votre application utilise le port ' + port)
})
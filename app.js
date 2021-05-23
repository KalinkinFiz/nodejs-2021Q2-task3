const express = require('express');

const app = express();
const db = require('./db');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');
const validate = require('./middleware/validate-session');

const PORT = 4000;

db.sync();
app.use(express.json());

app.use('/api/auth', user);
app.use(validate);

app.use('/api/game', game);
app.listen(PORT, () => {
    console.log('App is listening on 4000');
});

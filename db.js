const Sequelize = require('sequelize');
//                                 database username   password
const sequelize = new Sequelize('gamedb', 'postgres', '12345', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    });

module.exports = sequelize;

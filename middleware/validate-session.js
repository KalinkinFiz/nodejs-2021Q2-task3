const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../db').import('../models/user');

module.exports =  (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();   // allowing options as a method for request
    } else {
        const sessionToken = req.headers.authorization;
        console.log(sessionToken);
        if (!sessionToken) return res.status(StatusCodes.UNAUTHORIZED).json({ auth: false, message: "No token provided." });
        else {
            jwt.verify(sessionToken, 'lets_play_sum_games_man', (err, decoded) => {
                if (decoded) {
                    User.findOne({ where: { id: decoded.id } }).then(user => {
                        req.user = user;
                        console.log(`user: ${user}`)
                        next()
                    },
                        function () {
                            res.status(StatusCodes.UNAUTHORIZED).json({ error: "not authorized" });
                        })

                } else {
                    res.status(StatusCodes.BAD_REQUEST).json({ error: "not authorized" })
                }
            });
        }
    }
}
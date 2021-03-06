const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../db').import('../models/user');

router.post('/signup', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.user.username } });
    if (user) {
        res.status(StatusCodes.CONFLICT).json({
            code: 'USER_NOT_CREATE',
            msg: 'User whith this name exists',
        });
    } else {
        try {
            const user = await User.create({
                full_name: req.body.user.full_name,
                username: req.body.user.username,
                passwordHash: bcrypt.hashSync(req.body.user.password, 10),
                email: req.body.user.email,
            });
            const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', {
                expiresIn: 60 * 60 * 24,
            });
            res.status(StatusCodes.CREATED).json({
                user: user,
                token: token,
            });
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json(err.message);
        }
    }
});

router.post('/signin', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.user.username } });
    if (user) {
        bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
            if (matches) {
                const token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', {
                    expiresIn: 60 * 60 * 24,
                });
                res.json({
                    user: user,
                    message: 'Successfully authenticated.',
                    sessionToken: token,
                });
            } else {
                res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                    code: 'UNPROCESSABLE_ENTITY',
                    msg: 'Passwords do not match.',
                });
            }
        });
    } else {
        res.status(StatusCodes.NOT_FOUND).json({
            code: 'USER_NOT_FOUND',
            msg: 'User not found',
        });
    }
});

module.exports = router;

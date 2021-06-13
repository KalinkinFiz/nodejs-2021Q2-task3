const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();

const Game = require('../db').import('../models/game');

router.get('/all', async (req, res) => {
    try {
        const games = await Game.findAll({ where: { owner_id: req.user.id } });
        res.status(StatusCodes.OK).json({
            games: games,
            message: 'Games fetched.',
        });
    } catch {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Games not found' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
        res.status(StatusCodes.OK).json({
            game: game,
        });
    } catch (err) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Game not found' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const game = await Game.create({
            title: req.body.game.title,
            owner_id: req.user.id,
            studio: req.body.game.studio,
            esrb_rating: req.body.game.esrb_rating,
            user_rating: req.body.game.user_rating,
            have_played: req.body.game.have_played,
        });
        res.status(StatusCodes.CREATED).json({
            game: game,
            message: 'Game created.',
        });
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json(err.message);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const game = await Game.update(
            {
                title: req.body.game.title,
                studio: req.body.game.studio,
                esrb_rating: req.body.game.esrb_rating,
                user_rating: req.body.game.user_rating,
                have_played: req.body.game.have_played,
            },
            {
                where: {
                    id: req.params.id,
                    owner_id: req.user.id,
                },
            }
        );
        res.status(StatusCodes.OK).json({
            game: game,
            message: 'Successfully updated.',
        });
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
});

router.delete('/remove/:id', async (req, res) => {
    try {
        const game = await Game.destroy({
            where: {
                id: req.params.id,
                owner_id: req.user.id,
            },
        });
        res.status(StatusCodes.OK).json({
            game: game,
            message: 'Successfully deleted',
        });
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
});

module.exports = router;

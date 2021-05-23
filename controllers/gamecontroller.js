const { StatusCodes } = require('http-status-codes');
const router = require('express').Router();

const Game = require('../db').import('../models/game');

router.get('/all', (req, res) => {
    Game.findAll({ where: { owner_id: req.user.id } })
        .then(
            function findSuccess(games) {
                res.status(StatusCodes.OK).json({
                    games: games,
                    message: "Games fetched."
                })
            },

            function findFail() {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Games not found" })
            }
        )
})

router.get('/:id', (req, res) => {
    Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
        .then(
            function findSuccess(game) {
                res.status(StatusCodes.OK).json({
                    game: game
                })
            },

            function findFail(err) {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Game not found" })
            }
        )
})

router.post('/create', (req, res) => {
    Game.create({
        title: req.body.game.title,
        owner_id: req.user.id,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    })
        .then(
            function createSuccess(game) {
                res.status(StatusCodes.CREATED).json({
                    game: game,
                    message: "Game created."
                })
            },

            function createFail(err) {
                res.status(StatusCodes.BAD_REQUEST).json(err.message)
            }
        )
})

router.put('/update/:id', (req, res) => {
    Game.update({
        title: req.body.game.title,
        studio: req.body.game.studio,
        esrb_rating: req.body.game.esrb_rating,
        user_rating: req.body.game.user_rating,
        have_played: req.body.game.have_played
    },
        {
            where: {
                id: req.params.id,
                owner_id: req.user.id,
            }
        })
        .then(
            function updateSuccess(game) {
                res.status(StatusCodes.OK).json({
                    game: game,
                    message: "Successfully updated."
                })
            },

            function updateFail(err) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
            }

        )
})

router.delete('/remove/:id', (req, res) => {
    Game.destroy({
        where: {
            id: req.params.id,
            owner_id: req.user.id
        }
    })
    .then(
        function deleteSuccess(game) {
            res.status(StatusCodes.OK).json({
                game: game,
                message: "Successfully deleted"
            })
        },

        function deleteFail(err) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
        }
    )
})

module.exports = router;
const express = require('express')

const Favorite = require('../models/favorite')
const authenticate = require('../authenticate')
const cors = require('./cors')

const favoriteRouter = express.Router()

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .populate('user')
        .populate('dishes')
        .exec((err, favorites) => {
            if (err) return next(err)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorites)
        })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }, (err, favorite) => {
        if (err) return next(err)

        if (!favorite) {
            Favorite.create({ user: req.user._id })
                .then((favorite) => {
                    for (i = 0; i < req.body.length; i++) {
                        if (favorite.dishes.indexOf(req.body[i]._id)) {
                            favorite.dishes.push(req.body[i])
                        }
                    }
                    favorite.save()
                        .then((resp) => {
                            Favorite.findById(resp._id)
                                .populate('user')
                                .populate('dishes')
                                .then((finalFavorite) => {
                                    res.statusCode = 201
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json(finalFavorite)
                                })
                        })
                        .catch((err) => next(err))
                })
                .catch((err) => next(err))
        } else {
            for (i = 0; i < req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id)) {
                    favorite.dishes.push(req.body[i])
                }
            }
            favorite.save()
                .then((resp) => {
                    Favorite.findById(resp._id)
                        .populate('user')
                        .populate('dishes')
                        .then((finalFavorite) => {
                            res.statusCode = 201
                            res.setHeader('Content-Type', 'application/json')
                            res.json(finalFavorite)
                        })
                })
                .catch((err) => next(err))
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain')
    res.end('PUT operation not supported on /favorites')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndRemove({ user: req.user._id })
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                return res.json({ "exists": false, "favorites": favorites })
            } else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    return res.json({ "exists": false, "favorites": favorites })
                } else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    return res.json({ "exists": true, "favorites": favorites })
                }
            }
        })
        .catch((err) => {
            return next(err)
        })
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }, (err, favorite) => {
        if (err) return next(err)

        if (!favorite) {
            Favorite.create({ user: req.user._id })
                .then((resp) => {
                    resp.dishes.push({ "_id": req.params.dishId })
                    resp.save()
                        .then((favoriteDish) => {
                            Favorite.findById(favoriteDish._id)
                                .populate('user')
                                .populate('dishes')
                                .then((finalFavorite) => {
                                    res.statusCode = 201
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json(finalFavorite)
                                })
                        })
                        .catch((err) => {
                            return next(err)
                        })
                })
                .catch((err) => {
                    return next(err)
                })
        } else {
            if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                favorite.dishes.push({ "_id": req.params.dishId })
                favorite.save()
                    .then((favoriteDish) => {
                        Favorite.findById(favoriteDish._id)
                            .populate('user')
                            .populate('dishes')
                            .then((finalFavorite) => {
                                res.statusCode = 201
                                res.setHeader('Content-Type', 'application/json')
                                res.json(finalFavorite)
                            })
                    })
                    .catch((err) => {
                        return next(err)
                    })
            } else {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'text/plain')
                res.end('Dish ' + req.params.dishId + ' already has been added')
            }
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain')
    res.end('PUT operation not supported on /favorites/' + req.params.dishId + '')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }, (err, favorite) => {
        if (err) return next(err)

        var index = favorite.dishes.indexOf(req.params.dishId)
        if (index >= 0) {
            favorite.dishes.splice(index, 1)
            favorite.save()
                .then((resp) => {
                    Favorite.findById(resp._id)
                        .populate('user')
                        .populate('dishes')
                        .then((finalFavorite) => {
                            res.statusCode = 201
                            res.setHeader('Content-Type', 'application/json')
                            res.json(finalFavorite)
                        })
                })
                .catch((err) => {
                    return next(err)
                })
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain')
            res.end('Dish ' + req.params.dishId + ' not in your ')
        }
    })
})

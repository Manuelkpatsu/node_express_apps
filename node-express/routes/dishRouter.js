const express = require('express')

const Dish = require('../models/dish')
const authenticate = require('../authenticate')
const cors = require('./cors')

const dishRouter = express.Router()

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Dish.find({})
        .populate('comments.author')
        .then((dishes) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dishes)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.create(req.body)
        .then((dish) => {
            console.log('Dish created ', dish)
            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.remove({})
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .populate('comments.author')
        .then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId + '')
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
        .then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.findByIdAndRemove(req.params.dishId)
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .populate('comments.author')
        .then((dish) => {
            if (dish != null) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish.comments)
            } else {
                err = new Error('Dish ' + req.params.dishId + ' not found')
                err.statusCode = 404
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null) {
                req.body.author = req.user._id
                dish.comments.push(req.body)
                dish.save()
                    .then((resp) => {
                        Dish.findById(resp._id)
                            .populate('comments.author')
                            .then((finalDish) => {
                                res.statusCode = 201
                                res.setHeader('Content-Type', 'application/json')
                                res.json(finalDish)
                            })
                    }, (err) => next(err))
            } else {
                err = new Error('Dish ' + req.params.dishId + ' not found')
                err.statusCode = 404
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null) {
                for (var i = (dish.comments.length - 1); i >= 0; i--) {
                    dish.comments.id(dish.comments[i]._id).remove()
                }
                dish.save()
                    .then((resp) => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json')
                        res.json(resp)
                    }, (err) => next(err))
            } else {
                err = new Error('Dish ' + req.params.dishId + ' not found')
                err.statusCode = 404
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .populate('comments.author')
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(dish.comments.id(req.params.commentId))
            } else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found')
                err.statusCode = 404
                return next(err)
            } else {
                err = new Error('Comment ' + req.params.commentId + ' not found')
                err.statusCode = 404
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId)
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating
                }
                if (req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment
                }
                dish.save()
                    .then((resp) => {
                        Dish.findById(resp._id)
                            .populate('comments.author')
                            .then((finalDish) => {
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.json(finalDish)
                            })
                    }, (err) => next(err))
            } else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found')
                err.statusCode = 404
                return next(err)
            } else {
                err = new Error('Comment ' + req.params.commentId + ' not found')
                err.statusCode = 404
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then((dish) => {
            if (dish != null && dish.comments.id(req.params.commentId) != null) {
                dish.comments.id(req.params.commentId).remove()
                dish.save()
                    .then((resp) => {
                        Dish.findById(resp._id)
                            .populate('comments.author')
                            .then((finalDish) => {
                                res.statusCode = 200
                                res.setHeader('Content-Type', 'application/json')
                                res.json(finalDish)
                            })
                    }, (err) => next(err))
            } else if (dish == null) {
                err = new Error('Dish ' + req.params.dishId + ' not found')
                err.statusCode = 404
                return next(err)
            } else {
                err = new Error('Comment ' + req.params.commentId + ' not found')
                err.statusCode = 404
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})

module.exports = dishRouter

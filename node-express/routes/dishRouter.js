const express = require('express')

const Dish = require('../models/dish')
const authenticate = require('../authenticate')
const cors = require('./cors')

const dishRouter = express.Router()

dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, (req, res, next) => {
    Dish.find(req.query)
        .populate('comments.author')
        .then((dishes) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dishes)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.create(req.body)
        .then((dish) => {
            console.log('Dish created ', dish)
            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes')
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId + '')
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.findByIdAndRemove(req.params.dishId)
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

module.exports = dishRouter

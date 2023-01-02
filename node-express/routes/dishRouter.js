const express = require('express')
const mongoose = require('mongoose')

const Dish = require('../models/dish')

const dishRouter = express.Router()

dishRouter.route('/')
.get((req, res, next) => {
    Dish.find({})
        .then((dishes) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dishes)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post((req, res, next) => {
    Dish.create(req.body)
        .then((dish) => {
            console.log('Dish created ', dish)
            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes')
})
.delete((req, res, next) => {
    Dish.remove({})
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

dishRouter.route('/:dishId')
.get((req, res, next) => {
    Dish.findById(req.params.dishId)
        .then((dish) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(dish)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403
    res.end('POST operation not supported on /dishes/' + req.params.dishId + '')
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
    Dish.findByIdAndRemove(req.params.dishId)
        .then((resp) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})

module.exports = dishRouter

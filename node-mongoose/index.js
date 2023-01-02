const mongoose = require('mongoose')

const dish = require('./models/dish');
const Dish = require('./models/dish');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url)

connect.then((db) => {
    console.log('Connected correctly to the server')

    Dish.create({
        name: 'Uthapizza',
        description: 'test'
    })
    .then((dish) => {
        console.log(dish)

        return Dish.find({}).exec()
    })
    .then((dishes) => {
        console.log(dishes)

        return Dish.remove({})
    })
    .then(() => {
        return mongoose.connection.close()
    })
    .catch((err) => {
        console.log(err)
    })
})
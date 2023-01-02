const mongoose = require('mongoose')

const dish = require('./models/dish');
const Dish = require('./models/dish');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url)

connect.then((db) => {
    console.log('Connected correctly to the server')

    var newDish = new Dish({
        name: 'Uthapizza',
        description: 'test'
    })

    newDish.save()
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
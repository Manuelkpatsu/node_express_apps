const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const authenticate = require('../authenticate')
const cors = require('./cors')

const router = express.Router()

router.options('*', cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
})

router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
        .then((users) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(users)
        })
        .catch((err) => {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({err: err})
        })
})

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
    User.register(new User({username: req.body.username}),
        req.body.password, (err, user) => {
            if(err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.json({err: err})
            } else {
                if (req.body.firstname) {
                    user.firstname = req.body.firstname
                }

                if (req.body.lastname) {
                    user.lastname = req.body.lastname
                }

                user.save((err, user) => {
                    if (err) {
                        res.statusCode = 500
                        res.setHeader('Content-Type', 'application/json')
                        res.json({err: err})
                        return
                    }

                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 201
                        res.setHeader('Content-Type', 'application/json')
                        res.json({success: true, status: 'Registration Successful!'})
                    })
                })
            }
        })
});
  
router.post('/login', cors.corsWithOptions, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        } else if (!user) {
            res.statusCode = 401
            res.setHeader('Content-Type', 'application/json')
            res.json({
                success: false,
                status: 'Login unsuccessful!',
                err: info
            })
        } else {
            req.logIn(user, (err) => {
                if (err) {
                    res.statusCode = 401
                    res.setHeader('Content-Type', 'application/json')
                    res.json({
                        success: false,
                        status: 'Login unsuccessful!',
                        err: 'Could not log in user!'
                    })
                }

                const token = authenticate.getToken({_id: req.user._id})
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({
                    success: true,
                    token: token,
                    status: 'You are Successfully logged in!'
                })
            })
        }
    }) (req, res, next)
})
  
router.get('/logout', cors.corsWithOptions, (req, res) => {
    if (req.session) {
        req.session.destroy()
        res.clearCookie('session-id')
        res.redirect('/')
    } else {
        var err = new Error('You are not logged in!')
        err.status = 403
        next(err)
    }
})

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
        const token = authenticate.getToken({_id: req.user._id})
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({
            success: true,
            token: token,
            status: 'You are Successfully logged in!'
        })
    }
})

router.get('/checkJWTToken', cors.corsWithOptions, (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        } else if (!user) {
            res.statusCode = 401
            res.setHeader('Content-Type', 'application/json')
            return res.json({ status: 'JWT invalid!', success: false, err: info })
        } else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            return res.json({ status: 'JWT valid!', success: true, user: user })
        }
    })
})

module.exports = router

const express = require('express')
const User = require('../model/users')

const router = express.Router()
const auth = require('../middleware/authentication')


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        await user.populate('organization').execPopulate()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.checkCredentials(req.body.email, req.body.password)

        if (!user) {
            res.status(404).send("Login error")
        }

        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})

router.get('/users', auth, async (req, res) => {
    const match = {}
    const sort = {}
    let userlimit, userSkip;
    if (req.query.firstname) {
        match.firstname = req.query.firstname
    }

    if (req.query.lastname) {
        match.lastname = req.query.lastname
    }

    if (req.query.employeeID) {
        match.employeeID = req.query.employeeID
    }

    if (req.query.limit) {
        userlimit = parseInt(req.query.limit)
    }

    if (req.query.skip) {
        userSkip = parseInt(req.query.skip)
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    // 'organization'
    try {
        console.log(match);
        const user = await User.find(match).skip(userSkip).limit(userlimit).sort(sort).populate({
            path: 'organization'
        }).exec();
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstname', 'lastname', 'age', 'password', 'email', 'organization']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send("Invalid update operation")
    }

    try {
        const user = req.user;
        updates.forEach(update => user[update] = req.body[update])

        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router
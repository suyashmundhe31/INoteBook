const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

//Create a User using: PORT "/api/auth/createuser" . No login required
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'PAssword must be atleast 5 charac').isLength({ min: 5 }),
], async (req, res) => {
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // res.send(req.body);

    //If there are errors, return Bad request and the errors  
    const result = validationResult(req);
    if (result.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //check wheather the user with same email exist already
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry a user with a this email already exists' })
        }
        user = await User.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        })
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).sent('Some error occured');
    }
    // .then(user=> res.json(user)).catch(err=> {console.log(err) 
    //     res.json({error: 'Please enter a unique value for email', msg : err.message})});
})

module.exports = router;
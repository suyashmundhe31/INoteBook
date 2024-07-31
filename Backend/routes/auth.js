const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = '$uyashWebsite'

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
    try {
        //check wheather the user with same email exist already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Sorry a user with a this email already exists' })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password , salt);
        //Create new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user :{
                id : user.id
            }
        }
        const token = jwt.sign(data,JWT_SECRET);
        res.json({token});
    } catch (error) {
        console.error(error.message);
        res.status(500).sent('Some error occured');
    }
    // .then(user=> res.json(user)).catch(err=> {console.log(err) 
    //     res.json({error: 'Please enter a unique value for email', msg : err.message})});
})

router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    //If there are errors, return Bad request and the errors  
    const result = validationResult(req);
    if (result.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: 'Please try to login with valid creadentials' });
        }
        const passwordCompare = await bcrypt.compare(password,user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: 'Please try to login with valid creadentials' });
        }
        const data = {
            user :{
                id : user.id
            }
        }
        const token = jwt.sign(data,JWT_SECRET);
        res.json({token}); 
    } catch (error) {
        console.error(error.message);
        res.status(500).sent('Internal Server Error');
    }
}
)

module.exports = router;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const gravatar = require('gravatar');
const config=require('config');
//@route get api/users   @description Register user     @access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 4 or more characters').isLength({ min: 4 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
        //See if user exists
        let user = await User.findOne({ email });
        let username= await User.findOne({name});
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User with this E-mail already Exists' }] });
        }
        if (username) {
            return res.status(400).json({ errors: [{ msg: 'Use another Username! This is already registered' }] });
        }
        //Get users Gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        user = new User({
            email,
            name,
            password,
            avatar
        });
        //Encrypt the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        //Save user

        await user.save();
        //Return jsonwebtoken
        const payload = {
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:10000},(err,token)=>{
            if(err)
            {
                throw err;
            }
            res.json({token});
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;
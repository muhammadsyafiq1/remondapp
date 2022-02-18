const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
// require validasi
const { check, validationResult } = require('express-validator');
//require model
const User = require('../../models/User');

// POST
// Register user
// Public

router.post('/', [
    // validasi
    check('name', 'Nama harus diisi').not().isEmpty(),
    check('email', 'Isi dengan email valid').isEmail(),
    check('password', 'Isi lebih dari 6 karakter').isLength({min: 6})
], async (req, res) => {
    //handle request
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //membuat variable destructure
    const {name, email, password} = req.body;

    //membuat try catch
    try{
        let user = await User.findOne({ email });
        //user exist
        if(user){
            return res.status(400).json({error: [{msg :"User email sudah terdaftar"}]})
        }

        //get users gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // encrypt password
        //format hash dengan salt
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtsecret'),
            {expiresIn:360000},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        )

    }catch(err){
        console.log(err.message);
        res.status(500).send("server error")
    }

});

//export route
module.exports = router;
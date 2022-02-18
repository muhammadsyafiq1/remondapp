const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// ambil data user
router.get('/', auth , async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message);
    }
});

// login
router.post('/', [
    // validasi
    check('email', 'Isi harus diisi').isEmail(),
    check('password', 'Isi harus diisi').exists()
], async (req, res) => {
    //handle request
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    //membuat variable destructure
    const {email, password} = req.body;

    //membuat try catch
    try{
        let user = await User.findOne({ email });
        //user not exist
        if(!user){
            return res.status(400).json({error: [{msg :"User invalid"}]})
        }

        //compare password
        const isMatch  = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({error: [{msg: "User invalid"}]})
        }

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
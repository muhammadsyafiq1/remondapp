const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //ambil token dari header
    const token = req.header('x-auth-token');

    //jika token tidak ada
    if(!token) {
        return res.status(401).json({ msg: 'Anda tidak memiliki token ,authorisasi ditolak' })
    }

    //verify token (decoded)
    try{
        const decoded = jwt.verify(token, config.get('jwtsecret'));

        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({ msg: "Token anda tidak valid" });
    }
}
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//koneksi DB
const connectDB = async() => {
    try{
        await mongoose.connect(db, {useNewUrlParser:true});

        console.log('mongoose connected!');
    }catch(err){
        console.error(err.message);

        // exit jika error
        process.exit(1);
    }
}

//export module
module.exports = connectDB;
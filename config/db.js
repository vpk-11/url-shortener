const mongoose = require('mongoose');
const config = require('config');
const { copyFileSync } = require('fs');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true  // otherwise erros will be generated
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
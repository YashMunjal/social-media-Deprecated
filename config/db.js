//for mongo connection 

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log('mongoDB connected');
    }
    catch (e) {
        console.log(e.message);
        //exit process in case of failure
        process.exit(1)
    }
}
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex',true);
module.exports = connectDB;
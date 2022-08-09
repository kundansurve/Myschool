const mongoose = require("mongoose");

const connect = () => {
    try {
        const mongoUri = `mongodb://localhost:27017`;        ;

        return mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
        console.log(`Error connecting to MongoDB: ${err}`);
        throw err;
    }
    
};

const getClient = () => {
    return mongoose.connection.getClient();
}

module.exports = {
    connect,
    getClient
};
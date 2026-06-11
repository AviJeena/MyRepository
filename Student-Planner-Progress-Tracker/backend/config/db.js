const mongoose = require('mongoose');

/**
 * Establishes a connection pool to the MongoDB instance.
 * Utilizes environment configurations for secure authorization credentials.
 */
const connectDB = async () => {
    try {
        // Fallback local string context used if production .env variables aren't initialized
        const connURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentPlannerDB';
        
        const conn = await mongoose.connect(connURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`🍃 MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        // Terminate the process tracking thread instantly with a failure flag
        process.exit(1);
    }
};

module.exports = connectDB;
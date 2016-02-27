import mongoose from 'mongoose';
import config from '../data/config/index.js';
import User from './users/user-schema.js';

// Build the connection string
function getDbUri() {
    var dbConfigUrl = process.env.DB_URI || config.getConfig().db.url;
    return dbConfigUrl;
}
var dbURI = getDbUri();

// Create the database connection
console.log('connecting to database: ' + dbURI);
mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

// BRING IN SCHEMAS & MODELS
export { User };
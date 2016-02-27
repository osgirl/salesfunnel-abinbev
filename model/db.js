import mongoose from 'mongoose';
import config from '../data/config/index.js';

let dbURI = process.env.DB_URI || config.getConfig().db.url;
let options = {
    server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
    replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
};

function addConnectionEvents(callback) {
    var conn = mongoose.connection;

    conn.on('connected', function () {
        console.log('Mongoose default connection open');
    });

    conn.once('open', function () {
        callback();
    });

    conn.on('error', function (err) {
        console.error.bind('Mongoose default connection error: ' + err);
    });

    conn.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}

export function connectToDatabase(callback) {
        addConnectionEvents(callback);
        mongoose.connect(dbURI, options);
};
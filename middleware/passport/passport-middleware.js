import passport from 'passport';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import { Strategy } from 'passport-local';
import mongoose from 'mongoose';
import UserService from '../../services/user-service.js';
import flash from 'connect-flash';
import { verifyPassword, hashPassword } from '../crypto/crypto-pbkdf2.js';
//https://github.com/kcbanner/connect-mongo
import connectMongo from 'connect-mongo/es5';


/** Exported data **/
export function initialisePassport(app, secret) {
    var mongoStore = connectMongo(expressSession);
    app.use(cookieParser());
    app.use(flash());
    if (process.env.NODE_ENV !== "test") {
        app.use(expressSession({
            secret: secret,
            resave: false,
            saveUninitialized: false,
            store: new mongoStore({
                mongooseConnection: mongoose.connection
            })
        }));
    } else {
        app.use(expressSession({
            secret: secret,
            resave: false,
            saveUninitialized: false
        }));
    }
    app.use(passport.initialize());
    app.use(passport.session());
}

export function addLocalStrategyForUserAuthentication() {
    passport.use(new Strategy(function (username, password, done) {
        UserService.findByEmail(username, (err, user) => {
            if (err) return done(err);
            if (!user) {
                return done(null, false, {message: 'The user with email ' + username + ' does not exist.'});
            }
            return verifyPassword(user.pw, password, (err, isValid) => {
                if (err) return done(err);
                if (!isValid) return done(null, false, {message: 'The password is incorrect'});

                return done(null, {
                    id: user._id,
                    name: user.userName,
                    email: user.email
                })
            });
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (userId, done) {
        getAuthenticatedUser(userId)
            .then(function (userObject) {
                done(null, userObject);
            })
            .catch(function (err) {
                done(err, null);
            })
    });
}

export function doUserAuthentication(redirectObject) {
    return passport.authenticate('local', redirectObject);
}

export function getAuthenticatedUser(userId) {
    return new Promise(function (resolve, reject) {
        UserService.findById(userId, (err, user) => {
            if (err) reject(err);
            resolve({
                id: user._id,
                email: user.email,
                userName: user.userName
            });
        });
    });
}
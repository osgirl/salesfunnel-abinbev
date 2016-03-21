import staticData from './data/config/index';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes/index';
import migrations from './migrations/helpers/migration-loader';
import { initialisePassport } from './middleware/passport/passport-middleware.js';

var app = express();

migrations.loadMigrations();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.locals.layout = staticData.getConfig().layout;

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
initialisePassport(app, process.env.SESSION_SECRET || staticData.getConfig().sessionSecret);

app.use('/', routes.authenticatedRoutes);
app.use('/logout', routes.logout);
app.use('/login', routes.login);
app.use('/signup', routes.signup);
app.use('/reset-password', routes.resetPassword);
app.use('/registration', routes.registration);
app.use('/salesfunnel', routes.salesfunnel);
app.use('/*', routes.redirect);

// ERROR HANDLERS
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

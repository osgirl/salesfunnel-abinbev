import express from 'express';
import {UserService} from '../services/index';
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    UserService.getUsers(renderPage);

    function renderPage(err, users) {
        if (err) {
            next(err);
        } else {
            doRender(users);
        }

        function doRender(users) {
            res.render('users', {
                    metaData: {
                        title: 'Sales funnel - reporting tool - AB Inbev',
                        description: 'This is a reporting tool by and from AB Inbev to report about sales prospects'
                    },
                    content: createUsersContent(users)
                }
            );

            function createUsersContent(users) {
                var content = {};
                content.users = users;
                return content;
            }
        }
    }

});

export default router;

import url from 'url';

export function getBaseUrl(req) {
    //Because of Heroku's automatic https enabled
    var protocol = req.protocol;
    if (process.env.NODE_ENV === "production") protocol = 'https';

    return url.format({
        protocol: protocol,
        host: req.get('host'),
        pathname: '/'
    });
}
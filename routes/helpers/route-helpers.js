import url from 'url';

export function getBaseUrl(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: '/'
    });
}
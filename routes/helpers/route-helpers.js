import url from 'url';

export function getBaseUrl(req) {
    //TODO fix hardcoded https with secure connection
    return url.format({
        protocol: 'https',
        host: req.get('host'),
        pathname: '/'
    });
}
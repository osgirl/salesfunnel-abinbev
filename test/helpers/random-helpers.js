export function getRandomString() {
    return Math.random().toString(36).substring(7);
}


export function getRandomPathReq() {
    return '/' + getRandomString();
}
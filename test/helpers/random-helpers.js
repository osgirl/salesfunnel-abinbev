import uuid from 'uuid';
import { Types } from 'mongoose';

export function getRandomString() {
    return Math.random().toString(36).substring(7);
}


export function getRandomPathReq() {
    return '/' + getRandomString();
}

export function getRandomUUID() {
    return uuid.v4();
}

export function getNewObjectId() {
    return Types.ObjectId();
}
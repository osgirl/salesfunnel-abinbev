import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var userSchema = new Schema({
    userName: String,
    email: { type: String, index: {unique: true}},
    roleRef: { type: String, ref: 'Role', required: true},
    teamRef: { type: String, ref: 'Team'},
    pw: String,
    isVerified: Boolean,
    verificationToken: String,
    verificationEmailCounter: Number
}, {collection: 'users'});

export default mongoose.model('User', userSchema);
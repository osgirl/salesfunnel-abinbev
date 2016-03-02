import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var userSchema = new Schema({
    userName: String,
    email: { type: String, index: {unique: true}},
    roleRef: { type: Schema.Types.ObjectId, ref: 'Role'},
    teamRef: { type: Schema.Types.ObjectId, ref: 'Team'},
    pw: String,
    isValidated: Boolean
}, {collection: 'users'});

export default mongoose.model('User', userSchema);
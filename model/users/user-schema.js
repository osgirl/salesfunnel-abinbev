import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var userSchema = new Schema({
    userName: String
}, {collection: 'users'});

export default mongoose.model('User', userSchema);
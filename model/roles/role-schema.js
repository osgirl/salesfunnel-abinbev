import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var roleSchema = new Schema({
    _id: String,
    roleName: String
}, {collection: 'roles'});

export default mongoose.model('Role', roleSchema);
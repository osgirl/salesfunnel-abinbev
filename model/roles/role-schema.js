import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var roleSchema = new Schema({
    roleName: String
}, {collection: 'roles'});

export default mongoose.model('Role', roleSchema);
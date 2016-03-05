import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var teamSchema = new Schema({
    _id: String,
    teamName: String
}, {collection: 'teams'});

export default mongoose.model('Team', teamSchema);
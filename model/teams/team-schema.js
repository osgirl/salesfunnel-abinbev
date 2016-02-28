import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var teamSchema = new Schema({
    teamName: String
}, {collection: 'teams'});

export default mongoose.model('Team', teamSchema);
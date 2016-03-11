import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var registrationSchema = new Schema({
    userRef: { type: Schema.Types.ObjectId, ref: 'User', index:true},
    teamRef: { type: String, ref: 'Team', index:true},
    date: Date,
    visits: Number,
    negos: Number,
    proposals: Number,
    deals: Number,
    updated: {type: Date, default: Date.now }
}, {collection: 'registrations'});

registrationSchema.index({userRef: 1, date: 1}, {unique: true});
registrationSchema.index({teamRef: 1, date: 1});

export default mongoose.model('Registration', registrationSchema);
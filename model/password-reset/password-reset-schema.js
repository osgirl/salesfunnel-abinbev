import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var passwordResetSchema = new Schema({
    userRef: { type: Schema.Types.ObjectId, ref: 'User', index:true},
    pwResetToken: { type: String, index:true},
    isReset: Boolean,
    creationDate: {type: Date, default: Date.now }
}, {collection: 'resets'});

passwordResetSchema.index({userRef: 1, isReset: 1, creationDate: 1}, {unique: true});

export default mongoose.model('PasswordResetRepository', passwordResetSchema);
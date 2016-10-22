import mongoose from 'mongoose';
import { Schema } from 'mongoose';

var userSchema = new Schema({
    userName: String,
    email: { type: String, lowercase: true, index: {unique: true}},
    roleRef: { type: String, ref: 'Role', required: true},
    teamRef: { type: String, ref: 'Team', index:true},
    pw: String,
    isVerified: Boolean,
    verificationToken: String,
    verificationEmailCounter: Number,
    isAdmin: { type: Boolean, index: true, default:false},
    isDeleted: { type: Boolean, index: true, default:false},
    updatedBy: { type: String, ref: 'User'}
}, {collection: 'users'});

userSchema.index({teamRef: 1, isDeleted: 1});
userSchema.index({isAdmin: 1, isDeleted: 1});
userSchema.index({roleRef: 1, isDeleted: 1});
userSchema.index({roleRef: 1, teamRef: 1, isDeleted: 1});

export default mongoose.model('User', userSchema);
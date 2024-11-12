import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User',
    },
    actionType: {
        type: String,
        enum: ['follow', 'unfollow', 'like', 'unlike', 'comment'], 
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false, 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});


const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
//TODO:RECIEVE NOTIFICATIONS
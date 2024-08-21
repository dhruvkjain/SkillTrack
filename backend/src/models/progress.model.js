const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    nextVideo:{
        type: Number,
        required: true,
        default: 0
    },
    progress: {
        type: Number,
        required: true,
        default: 0
    },
    completedVideos: {
        type: [Number],
        default: []
    },
    pauseTime: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Progres', progressSchema) ;
// collection of name progress is formed here.
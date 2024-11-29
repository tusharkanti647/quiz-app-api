import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    quizName: {
        type: 'string',
        required: true
    },
    quizDescription: {
        type: 'string',
        required: true,
        unique: true,
    },
    difficultLabel: {
        type: 'string',
        required: true
    },
    numberOfQuestion: {
        type: 'number',
        required: true
    },
    quizPhoto: {
        type: 'string',
        default: '',
    },
    categories: {
        type: ['string'],
    },
    question: {
        type: Map,
        of: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    },
}, { timestamps: true });

export const Quiz = mongoose.model('Quiz', quizSchema);


import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({

    questionBody: {
        type: 'string',
        required: true
    },
    options:
    {
        type: ['string'],
        required: true
    },
    ansOption: {
        type: 'number',
        required: true
    },
  
    category: {
        type: 'number',
        // required: true
    },
    questionValue: {
        type: 'number',
        required: true
    }

}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);
// export const Quiz = mongoose.model('Quiz', quizSchema);






  
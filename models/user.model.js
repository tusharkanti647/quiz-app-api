import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true,
        unique: true,
    },
    password: {
        type: 'string',
        // required: true
    },
    profilePhoto: {
        type: 'string',
        default: '',
    },
    currentQuiz: {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        questionsAns: {
            type: [
                {
                    // quizId: {
                    //     type: mongoose.Schema.Types.ObjectId,
                    //     ref: 'Quiz'
                    // },
                    questionId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Question'
                    },
                    ansOption: {
                        type: 'number',
                    }
                }
            ]
        },

        currentQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        nextQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        previousQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }
    },
    userPerformances: {
        completedQuiz: [{
            // eachCompletedQuiz: {
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
            correctCount: { type: 'number' },
            wrongCount: { type: 'number' },
            quizPerformancePercentage: { type: 'number' },
            // }
        }],
        overAllPerformances: {
            type: 'number'
        },
        suggestion: {
            type: 'string',
        }
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);

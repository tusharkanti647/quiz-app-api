import { User } from "../models/user.model.js";


const checkQuizCompleted = async (req, res, next) => {
    try {
        const userId = req.id;

        // Fetch user to check currentQuiz details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        let quizId = req.query.quizId;
        if (!quizId) {
            quizId = req.body.quizId;
        }


        // Check if the quiz has been previously attempted
        const completedQuiz = user.userPerformances.completedQuiz.find(
            quiz => quiz.quizId.toString() === quizId
        );
        // console.log('MMMMMMMMMMMMMMMMMMMM11111', completedQuiz)
        if (completedQuiz) {
            req.completedQuiz = completedQuiz;
        }

        next();
    } catch (e) {
        console.log('ERROR', e)
    }

}

export default checkQuizCompleted;
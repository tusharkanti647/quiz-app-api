import { User } from "../models/user.model.js";


const quizDelete = async (req, res, next) => {
    try {
        const userId = req.id;
        let quizId = req.query.quizId;
        // console.log('quizId', quizId)
        if (!quizId) {
            quizId = req.body.quizId;
        }

        // Fetch user to check currentQuiz details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.currentQuiz) {
            // console.log(user?.currentQuiz, "FFFFFFFFFFFFFFF", quizId, !user?.currentQuiz?.quizId?.equals(quizId))
            if (!quizId || !user?.currentQuiz?.quizId?.equals(quizId)) {
                // console.log('MMMMMMMMMM')
                user.currentQuiz = undefined;
                await user.save();
            }
        }
        next();
    } catch (e) {
        console.log('ERROR', e)
    }

}

export default quizDelete;
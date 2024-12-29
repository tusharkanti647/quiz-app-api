// import express from 'express';
import express from 'express';
import { addQuizzes, getQuizList, navigatePreviousQuestion, navigateQuestion, reloadQuestion, startQuiz } from '../controllers/quizControllers.js';
import isAuthenticated from '../middlewares/authenticated.js';
import quizDelete from '../middlewares/currentQuizDelet.js';
import checkQuizCompleted from '../middlewares/checkQuizCompleted.js';

const router = express.Router();

router.route('/getQuizList').get(getQuizList);
router.route('/startQuiz').get(isAuthenticated, quizDelete, checkQuizCompleted, startQuiz);
router.route('/navigateQuestion').post(isAuthenticated, quizDelete, checkQuizCompleted, navigateQuestion);
router.route('/navigatePreviousQuestion').post(isAuthenticated, quizDelete, checkQuizCompleted, navigatePreviousQuestion);
router.route('/reloadQuestion').get(isAuthenticated, quizDelete, checkQuizCompleted, reloadQuestion);
router.route('/addQuizzes').post(addQuizzes); //addQuizzes navigateQuestion 



export default router;
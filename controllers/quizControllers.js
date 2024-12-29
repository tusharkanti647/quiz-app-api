import { Quiz } from "../models/quiz.model.js";
import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";

export const getQuizList = async (req, res) => {
    try {
        // Fetch all quizzes with questions populated
        const quizzes = await Quiz.find();

        // Respond with the quiz list
        return res.status(200).json({
            success: true,
            data: quizzes,
        });
    } catch (err) {
        console.error("Error fetching quiz list:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }

}

//Set the Current Quiz and Fetch First Question
export const startQuiz = async (req, res) => {
    const quizId = req.query.quizId;
    const userId = req.id; // Get userId from cookies
    let isCompleted = false;

    const completedQuiz = req.completedQuiz;
    if (completedQuiz) {
        isCompleted = true
    }


    // console.log("userId", userId, 'uuu', quizId)
    if (!quizId) {
        return res.status(400).json({ success: false, message: "Quiz ID required." });
    }

    try {
        // Fetch user to check currentQuiz details
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if the user is already taking a quiz
        if (user.currentQuiz?.quizId) {
            return res.status(400).json({
                success: false,
                message: "You already have an ongoing quiz. Please complete it before starting a new one.",
                currentQuiz: user.currentQuiz,
            });
        }

        // Fetch the quiz and its questions
        // const quiz = await Quiz.findById(quizId).populate("question");
        const quiz = await Quiz.findById(quizId);

        // let populatedQuestions;
        //populat the quiz question
        if (quiz && quiz.question) {
            // let isQuizIsAttempted = false;
            // user?.userPerformances?.completedQuiz.map((ele) => {
            //     if (ele.quizId.toString() == quizId.toString()) {
            //         isQuizIsAttempted = true;
            //     }
            // })
            // if (isQuizIsAttempted) {
            //     return res.status(200).json({ success: true, message: "You have attempted the quiz.", quizIsNotStart: true });
            // }
        } else {
            return res.status(404).json({ success: false, message: "Quiz or questions not found." });
        }


        // console.log(quiz.question)
        // Determine the first question and navigation IDs
        let categories1st = quiz.categories[0];
        let categories2nd = quiz.categories[1] || null;
        const firstQuestionId = quiz.question.get(categories1st)?.[0];
        const nextQuestionId = quiz.question.get(categories1st)?.[1] || quiz.question.get(categories2nd)?.[0] || null;
        // const nextQuestionId = quiz.question[1]?._id || null;

        const firstQuestion = await Question.findById(firstQuestionId);
        // console.log(firstQuestionId, nextQuestionId)
        // Update user's currentQuiz
        user.currentQuiz = {
            quizId: quizId,
            currentQuestionId: firstQuestion._id,
            nextQuestionId: nextQuestionId,
            previousQuestionId: null,
            categories: quiz.categories,
        };
        await user.save();

        let completedQuizDetails = {}
        if (isCompleted) {
            for (let i = 0; i < completedQuiz.questionsAns.length; i++) {
                let objEle = completedQuiz.questionsAns[i]

                if (objEle.questionId.toString() === firstQuestion._id.toString()) {

                    const question = await Question.findById(objEle.questionId);
                    completedQuizDetails.userAnsOption = objEle.ansOption
                    completedQuizDetails.ansOption = question.ansOption
                    break;
                }
            }


            completedQuizDetails.isQuizCompleted = true
        }
        // Send response with the first question and navigation IDs
        res.status(200).json({
            success: true,
            question: {
                questionBody: firstQuestion.questionBody,
                options: firstQuestion.options,
                questionValue: firstQuestion.questionValue,
                questionId: firstQuestion._id,
            },
            navigation: {
                previousQuestionId: null,
                nextQuestionId: nextQuestionId,
            },
            questionList: quiz.question,
            categories: quiz.categories,
            completedQuizDetails: completedQuizDetails
        });

    } catch (error) {
        console.error("Error starting quiz:", error);
        res.status(500).json({ success: false, message: "An error occurred while starting the quiz." });
    }
};


//------------------------------------------------------------------------------------------

export const navigateQuestion = async (req, res) => {
    const { quizId, answer, reqQuestionId } = req.body; // `answer` corresponds to the current question
    const userId = req.id; // Assuming userId is extracted from cookies or authentication middleware



    try {
        let isCompleted = false;

        const completedQuiz = req.completedQuiz;
        if (completedQuiz) {
            isCompleted = true
        }

        // Fetch the user and check for currentQuiz
        const user = await User.findById(userId) //.populate('currentQuiz.quizId');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const { currentQuiz } = user;

        // console.log(currentQuiz)

        if (!currentQuiz || !currentQuiz.quizId.equals(quizId)) {
            return res.status(400).json({
                success: false,
                message: "No ongoing quiz matches the provided quiz ID.",
            });
        }

        const { currentQuestionId, nextQuestionId, questionsAns } = currentQuiz;

        if (!currentQuestionId) {
            return res.status(400).json({
                success: false,
                message: "No current question is set in the quiz.",
            });
        }

        if (isCompleted) {
            // Update the user's answer for the current question
            let ansIndex = user.currentQuiz.questionsAns.findIndex((arrElement) => {
                // console.log('arrElement', arrElement, 'currentQuestionId', currentQuestionId)
                return arrElement.questionId.toString() === currentQuestionId.toString()
            })

            if (ansIndex !== -1) {
                // console.log("length", user.currentQuiz.questionsAns.length)
                user.currentQuiz.questionsAns[ansIndex].ansOption = answer;
                // console.log("length2", user.currentQuiz.questionsAns.length)
            } else {
                user.currentQuiz.questionsAns.push({
                    questionId: currentQuestionId,
                    ansOption: answer,
                });
            }
        }

        const quiz = await Quiz.findById(quizId)  //.populate('question');

        // populate the question
        // let populatedQuestions
        if (quiz && quiz.question) {

        } else {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        let questionIndex = -1;
        let categoryKey = '';

        quiz.question.forEach((questionsArr, noCategoryKey) => {
            // console.log(`${key}: ${value}`);
            const index = questionsArr.findIndex((q) => q.toString() === currentQuestionId.toString());

            if (index !== -1) {
                questionIndex = index;
                categoryKey = noCategoryKey;
            }

        });

        if (questionIndex === -1) {
            return res.status(404).json({ success: false, message: "Current question not found in quiz." });
        }

        let completedQuizDetails = {}
        if (isCompleted) {
            for (let i = 0; i < completedQuiz.questionsAns.length; i++) {
                let objEle = completedQuiz.questionsAns[i]

                if (objEle.questionId.toString() === currentQuestionId.toString()) {
                    const question = await Question.findById(objEle.questionId);
                    // console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', objEle.ansOption, question.ansOption)
                    completedQuizDetails.userAnsOption = objEle.ansOption
                    completedQuizDetails.ansOption = question.ansOption
                    break;
                }
            }

            completedQuizDetails.isQuizCompleted = true
        }


        // If it's the last question, submit the quiz
        if (!nextQuestionId) {
            let correctCount = 0;
            let correctEvaluationNumber = 0;
            let wrongCount = 0;
            let wrongEvaluationNumber = 0;

            // console.log('questionsAnsquestionsAns', user.currentQuiz.questionsAns)
            // Evaluate answers
            for (const ans of user.currentQuiz.questionsAns) {
                const question = await Question.findById(ans.questionId); //quiz.question.find((q) => q._id.equals(ans.questionId));
                if (question) {
                    if (question.ansOption === ans.ansOption) {
                        correctCount++;
                        correctEvaluationNumber += question.questionValue;
                    } else {
                        wrongCount++;
                        wrongEvaluationNumber += question.questionValue;
                    }
                }
            }

            // Calculate performance
            const totalQuestions = correctCount + wrongCount;
            const totalEvaluationNumber = correctEvaluationNumber + wrongEvaluationNumber;
            const performancePercentage = ((correctEvaluationNumber / totalEvaluationNumber) * 100).toFixed(2);

            // Store completed quiz performance
            user.userPerformances.completedQuiz.push({
                quizId: quizId,
                correctCount,
                wrongCount,
                quizPerformancePercentage: performancePercentage,
                questionsAns
            });


            let previousOverAllPerformances = parseInt(user.userPerformances.overAllPerformances || '0');
            user.userPerformances.overAllPerformances = (previousOverAllPerformances + parseInt(performancePercentage || '0')) / (previousOverAllPerformances == 0 ? 1 : 2);

            // Clear currentQuiz
            user.currentQuiz = undefined;

            await user.save();

            return res.status(200).json({
                success: true,
                message: "Quiz submitted successfully.",
                performance: {
                    correctCount,
                    wrongCount,
                    performancePercentage,
                },
                overallPerformance: user.userPerformances.overAllPerformances,
            });
        }

        // Otherwise, navigate to the next question
        const newPreviousQuestionId = currentQuestionId;
        const newCurrentQuestionId = nextQuestionId;
        // console.log(categoryKey, 'HHHH', quiz.categories.indexOf('categoryKey'))
        const nextCategory = quiz.categories[quiz.categories.indexOf(categoryKey) + 1] || null;
        let newNextQuestionId

        if (questionIndex + 2 < quiz.question.get(categoryKey).length) {
            newNextQuestionId = quiz.question.get(categoryKey)[questionIndex + 2]
        } else {
            if (nextCategory !== null && nextCategory !== undefined && nextCategory !== '') {
                if (questionIndex + 1 == quiz.question.get(categoryKey).length) {
                    newNextQuestionId = quiz.question.get(nextCategory)[1]
                } else {
                    newNextQuestionId = quiz.question.get(nextCategory)[0]
                }
            } else {
                newNextQuestionId = null
            }
        }

        const newCategoryKey = questionIndex + 2 <= quiz.question.get(categoryKey).length
            ? categoryKey
            : (nextCategory !== null && nextCategory !== undefined && nextCategory !== '')
                ? nextCategory
                : nextCategory

        // Update navigation details
        user.currentQuiz.currentQuestionId = newCurrentQuestionId;
        user.currentQuiz.previousQuestionId = newPreviousQuestionId;
        user.currentQuiz.nextQuestionId = newNextQuestionId;

        await user.save();

        // const nextQuestion = Question.find((q) =>
        //     q._id.equals(newCurrentQuestionId)
        // );
        const nextQuestion = await Question.findById(newCurrentQuestionId);

        res.status(200).json({
            success: true,
            message: "Navigation updated successfully.",
            currentQuestion: nextQuestion
                ? {
                    questionBody: nextQuestion.questionBody,
                    options: nextQuestion.options,
                    questionValue: nextQuestion.questionValue,
                    questionId: nextQuestion._id,
                }
                : null,
            navigation: {
                previousQuestionId: newPreviousQuestionId,
                nextQuestionId: newNextQuestionId,
            },
            questionList: quiz.question,
            categories: quiz.categories,
            category: newCategoryKey,
            questionsAns: currentQuiz.questionsAns,
            completedQuizDetails: completedQuizDetails
        });
    } catch (error) {
        console.error("Error navigating question:", error);
        res.status(500).json({ success: false, message: "An error occurred while navigating the quiz." });
    }
};

export const navigatePreviousQuestion = async (req, res) => {
    const { quizId, answer, reqQuestionId } = req.body; // `answer` corresponds to the current question
    const userId = req.id; // Assuming userId is extracted from cookies or authentication middleware

    try {
        let isCompleted = false;

        const completedQuiz = req.completedQuiz;
        if (completedQuiz) {
            isCompleted = true
        }

        // Fetch the user and check for currentQuiz
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const { currentQuiz } = user;

        if (!currentQuiz || !currentQuiz.quizId.equals(quizId)) {
            return res.status(400).json({
                success: false,
                message: "No ongoing quiz matches the provided quiz ID.",
            });
        }

        const { currentQuestionId, nextQuestionId, previousQuestionId } = currentQuiz;

        if (!currentQuestionId) {
            return res.status(400).json({
                success: false,
                message: "No current question is set in the quiz.",
            });
        }


        //if currentQuestionId and the reqQuestionId not equal the set the current question id as the reqQuestionId
        // if(currentQuestionId)

        // Update the user's answer for the current question
        let ansIndex = user.currentQuiz.questionsAns.findIndex((arrElement) => arrElement.questionId.toString() === currentQuestionId.toString())
        if (isCompleted) {
            if (ansIndex !== -1) {
                user.currentQuiz.questionsAns[ansIndex].ansOption = answer;
            } else {
                user.currentQuiz.questionsAns.push({
                    questionId: currentQuestionId,
                    ansOption: answer,
                });
            }
        }

        const quiz = await Quiz.findById(quizId)  //.populate('question');

        if (!quiz && !quiz.question) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        let questionIndex = -1;
        let categoryKey = '';

        quiz.question.forEach((questionsArr, noCategoryKey) => {
            // console.log(`${key}: ${value}`);
            const index = questionsArr.findIndex((q) => q.toString() === currentQuestionId.toString());

            if (index !== -1) {
                questionIndex = index;
                categoryKey = noCategoryKey; // Store the index of the group where the question was found
                // return true; // Break out of the loop when found
            }

        });

        if (questionIndex === -1) {
            return res.status(404).json({ success: false, message: "Current question not found in quiz." });
        }

        let completedQuizDetails = {}
       
        if (isCompleted) {
            for (let i = 0; i < completedQuiz.questionsAns.length; i++) {
                let objEle = completedQuiz.questionsAns[i]

                if (objEle.questionId.toString() === currentQuestionId.toString()) {
                    const question = await Question.findById(objEle.questionId);
                    // console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', objEle.ansOption, question.ansOption)
                    completedQuizDetails.userAnsOption = objEle.ansOption
                    completedQuizDetails.ansOption = question.ansOption
                    break;
                }
            }

            completedQuizDetails.isQuizCompleted = true
        }
        // console.log('FFFFFFFFFFFFFFFF', completedQuizDetails)
        if (!previousQuestionId) {
            await user.save();

            const nextQuestion = await Question.findById(currentQuestionId);

            return res.status(200).json({
                success: true,
                message: "Navigation updated successfully.",
                currentQuestion: nextQuestion
                    ? {
                        questionBody: nextQuestion.questionBody,
                        options: nextQuestion.options,
                        questionValue: nextQuestion.questionValue,
                        questionId: nextQuestion._id,
                    }
                    : null,
                navigation: {
                    previousQuestionId: null,
                    nextQuestionId: nextQuestionId,
                },
                questionList: quiz.question,
                categories: quiz.categories,
                category: categoryKey,
                questionsAns: currentQuiz.questionsAns,
                completedQuizDetails: completedQuizDetails,
            });

        }


        // Otherwise, navigate to the next question
        const newNextQuestionId = currentQuestionId;
        const newCurrentQuestionId = previousQuestionId;
        const prevCategory = quiz.categories[quiz.categories.indexOf(categoryKey) - 1] || null;
        let newPreviousQuestionId
        // console.log('categoryKey', prevCategory, categoryKey)
        if (questionIndex - 2 >= 0) {
            newPreviousQuestionId = quiz.question.get(categoryKey)[questionIndex - 2]
        } else {
            if (prevCategory !== null && prevCategory !== undefined && prevCategory !== '') {
                if (questionIndex - 1 == 0) {
                    newPreviousQuestionId = quiz.question.get(prevCategory).at(-1)
                } else {
                    newPreviousQuestionId = quiz.question.get(prevCategory).at(-2) || null
                }
            } else {
                newPreviousQuestionId = null

            }
        }



        const newPrevCategory = questionIndex - 2 >= -1
            ? categoryKey
            : (prevCategory !== null && prevCategory !== undefined && prevCategory !== '')
                ? prevCategory
                : prevCategory

        // Update navigation details
        user.currentQuiz.currentQuestionId = newCurrentQuestionId;
        user.currentQuiz.previousQuestionId = newPreviousQuestionId;
        user.currentQuiz.nextQuestionId = newNextQuestionId;

        await user.save();

        const nextQuestion = await Question.findById(newCurrentQuestionId);

        res.status(200).json({
            success: true,
            message: "Navigation updated successfully.",
            currentQuestion: nextQuestion
                ? {
                    questionBody: nextQuestion.questionBody,
                    options: nextQuestion.options,
                    questionValue: nextQuestion.questionValue,
                    questionId: nextQuestion._id,
                }
                : null,
            navigation: {
                previousQuestionId: newPreviousQuestionId,
                nextQuestionId: newNextQuestionId,
            },
            questionList: quiz.question,
            categories: quiz.categories,
            category: newPrevCategory,
            questionsAns: currentQuiz.questionsAns,
            completedQuizDetails: completedQuizDetails
        });

    } catch (error) {
        console.error("Error navigating question:", error);
        res.status(500).json({ success: false, message: "An error occurred while navigating the quiz." });
    }

}


export const reloadQuestion = async (req, res) => {
    const { quizId, questionId } = req.query
    const userId = req.id; // Assuming userId is extracted from cookies or authentication middleware

    try {
        let isCompleted = false;

        const completedQuiz = req.completedQuiz;
        if (completedQuiz) {
            isCompleted = true
        }

        // Fetch the user and check for currentQuiz
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const { currentQuiz } = user;

        if (!currentQuiz || !currentQuiz.quizId.equals(quizId)) {
            return res.status(400).json({
                success: false,
                message: "No ongoing quiz matches the provided quiz ID.",
            });
        }

        const { currentQuestionId, nextQuestionId, previousQuestionId } = currentQuiz;

        if (!currentQuestionId) {
            return res.status(400).json({
                success: false,
                message: "No current question is set in the quiz.",
            });
        }


        const quiz = await Quiz.findById(quizId)  //.populate('question');

        if (!quiz && !quiz.question) {
            return res.status(404).json({ success: false, message: "Quiz not found." });
        }

        let questionIndex = -1;
        let categoryKey = '';

        quiz.question.forEach((questionsArr, noCategoryKey) => {
            // console.log(`${key}: ${value}`);
            const index = questionsArr.findIndex((q) => q.toString() === currentQuestionId.toString());

            if (index !== -1) {
                questionIndex = index;
                categoryKey = noCategoryKey; // Store the index of the group where the question was found
                // return true; // Break out of the loop when found
            }

        });

        if (questionIndex === -1) {
            return res.status(404).json({ success: false, message: "Current question not found in quiz." });
        }

        let completedQuizDetails = {}
        if (isCompleted) {
            for (let i = 0; i < completedQuiz.questionsAns.length; i++) {
                let objEle = completedQuiz.questionsAns[i]

                if (objEle.questionId.toString() === currentQuestionId.toString()) {
                    const question = await Question.findById(objEle.questionId);
                    // console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', objEle.ansOption, question.ansOption)
                    completedQuizDetails.userAnsOption = objEle.ansOption
                    completedQuizDetails.ansOption = question.ansOption
                    break;
                }
            }

            completedQuizDetails.isQuizCompleted = true
        }


        const nextQuestion = await Question.findById(currentQuestionId);

        return res.status(200).json({
            success: true,
            message: "Navigation updated successfully.",
            currentQuestion: nextQuestion
                ? {
                    questionBody: nextQuestion.questionBody,
                    options: nextQuestion.options,
                    questionValue: nextQuestion.questionValue,
                    questionId: nextQuestion._id,
                }
                : null,
            navigation: {
                previousQuestionId: previousQuestionId,
                nextQuestionId: nextQuestionId,
            },
            questionList: quiz.question,
            categories: quiz.categories,
            category: categoryKey,
            questionsAns: currentQuiz.questionsAns,
            completedQuizDetails: completedQuizDetails,
        });

    } catch (error) {
        console.error("Error navigating question:", error);
        res.status(500).json({ success: false, message: "An error occurred while navigating the quiz." });
    }

}

//-------------------------------------------------------------------------


export const addQuizzes = async (req, res) => {
    try {
        const { quizzes } = req.body;

        if (!Array.isArray(quizzes) || quizzes.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid quiz data provided." });
        }

        const quizIds = [];

        for (const quiz of quizzes) {
            const questionMap = {};

            // Loop through each category and its questions
            for (const [category, questions] of Object.entries(quiz.question)) {
                const questionIds = [];

                // Loop through each question in the category
                for (const questionData of questions) {
                    const question = new Question({
                        questionBody: questionData.questionBody,
                        options: questionData.options,
                        ansOption: questionData.ansOption,
                        category: questionData.category,
                        questionValue: questionData.questionValue,
                    });

                    const savedQuestion = await question.save();
                    questionIds.push(savedQuestion._id);
                }


                questionMap[category] = questionIds;
            }

            // Save the quiz with related questions (categories with question IDs)
            const newQuiz = new Quiz({
                quizName: quiz.quizName,
                quizDescription: quiz.quizDescription,
                difficultLabel: quiz.difficultLabel,
                numberOfQuestion: quiz.numberOfQuestion,
                quizPhoto: quiz.quizPhoto || '',
                categories: quiz.categories,
                question: questionMap,
            });

            const savedQuiz = await newQuiz.save();
            quizIds.push(savedQuiz._id);
        }


        res.status(201).json({
            success: true,
            message: "Quizzes added successfully.",
            quizIds: quizIds,
        });
    } catch (error) {
        console.error("Error adding quizzes:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while saving quizzes.",
        });
    }
};

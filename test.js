{
    "quizzes": [
      {
        "quizName": "Quiz 1",
        "quizDescription": "Description of Quiz 1",
        "difficultLabel": "Easy",
        "numberOfQuestion": 4,
        "quizPhoto": "",
        "categories": ["Category 1", "Category 2"],
        "question": {
          "Category 1": [
            {
              "questionBody": "Question 1 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 0,
              "category": 1,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 1,
              "category": 1,
              "questionValue": 2
            }
          ],
          "Category 2": [
            {
              "questionBody": "Question 1 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 2,
              "category": 2,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 3,
              "category": 2,
              "questionValue": 2
            }
          ]
        }
      },
      {
        "quizName": "Quiz 2",
        "quizDescription": "Description of Quiz 2",
        "difficultLabel": "Medium",
        "numberOfQuestion": 4,
        "quizPhoto": "",
        "categories": ["Category 1", "Category 2"],
        "question": {
          "Category 1": [
            {
              "questionBody": "Question 1 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 0,
              "category": 1,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 1,
              "category": 1,
              "questionValue": 2
            }
          ],
          "Category 2": [
            {
              "questionBody": "Question 1 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 2,
              "category": 2,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 3,
              "category": 2,
              "questionValue": 2
            }
          ]
        }
      },
      {
        "quizName": "Quiz 3",
        "quizDescription": "Description of Quiz 3",
        "difficultLabel": "Hard",
        "numberOfQuestion": 4,
        "quizPhoto": "",
        "categories": ["Category 1", "Category 2"],
        "question": {
          "Category 1": [
            {
              "questionBody": "Question 1 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 0,
              "category": 1,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 1,
              "category": 1,
              "questionValue": 2
            }
          ],
          "Category 2": [
            {
              "questionBody": "Question 1 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 2,
              "category": 2,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 3,
              "category": 2,
              "questionValue": 2
            }
          ]
        }
      },
      {
        "quizName": "Quiz 4",
        "quizDescription": "Description of Quiz 4",
        "difficultLabel": "Easy",
        "numberOfQuestion": 4,
        "quizPhoto": "",
        "categories": ["Category 1", "Category 2"],
        "question": {
          "Category 1": [
            {
              "questionBody": "Question 1 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 0,
              "category": 1,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 1,
              "category": 1,
              "questionValue": 2
            }
          ],
          "Category 2": [
            {
              "questionBody": "Question 1 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 2,
              "category": 2,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 3,
              "category": 2,
              "questionValue": 2
            }
          ]
        }
      },
      {
        "quizName": "Quiz 5",
        "quizDescription": "Description of Quiz 5",
        "difficultLabel": "Medium",
        "numberOfQuestion": 4,
        "quizPhoto": "",
        "categories": ["Category 1", "Category 2"],
        "question": {
          "Category 1": [
            {
              "questionBody": "Question 1 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 0,
              "category": 1,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 1",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 1,
              "category": 1,
              "questionValue": 2
            }
          ],
          "Category 2": [
            {
              "questionBody": "Question 1 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 2,
              "category": 2,
              "questionValue": 1
            },
            {
              "questionBody": "Question 2 of Category 2",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "ansOption": 3,
              "category": 2,
              "questionValue": 2
            }
          ]
        }
      }
    ]
  }



  import { Quiz } from "../models/Quiz"; // Assuming you import the Quiz model
import { Question } from "../models/Question"; // Assuming you import the Question model

export const addQuizzes = async (req, res) => {
    try {
        const { quizzes } = req.body; // Get quizzes from request body

        if (!Array.isArray(quizzes) || quizzes.length === 0) {
            return res.status(400).json({ success: false, message: "Invalid quiz data provided." });
        }

        const quizIds = []; // To store the IDs of the quizzes added

        for (const quiz of quizzes) {
            const questionMap = {}; // To store question IDs by category

            // Loop through each category and its questions
            for (const [category, questions] of Object.entries(quiz.question)) {
                const questionIds = []; // To store question IDs for each category

                // Loop through each question in the category
                for (const questionData of questions) {
                    const question = new Question({
                        questionBody: questionData.questionBody,
                        options: questionData.options,
                        ansOption: questionData.ansOption,
                        category: questionData.category, // Category is passed as a number
                        questionValue: questionData.questionValue,
                    });

                    const savedQuestion = await question.save(); // Save the question
                    questionIds.push(savedQuestion._id); // Push the saved question's ID
                }

                // Add the array of question IDs to the category in the questionMap
                questionMap[category] = questionIds;
            }

            // Save the quiz with related questions (categories with question IDs)
            const newQuiz = new Quiz({
                quizName: quiz.quizName,
                quizDescription: quiz.quizDescription,
                difficultLabel: quiz.difficultLabel,
                numberOfQuestion: quiz.numberOfQuestion,
                quizPhoto: quiz.quizPhoto || '', // Default to empty string if no photo is provided
                categories: quiz.categories, // Categories are passed as an array
                question: questionMap, // Store the questionMap (category -> questionIds)
            });

            const savedQuiz = await newQuiz.save(); // Save the quiz
            quizIds.push(savedQuiz._id); // Push the saved quiz's ID
        }

        // Respond with success and the IDs of the saved quizzes
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


import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    storeQuestions: (state, action) => {
      const allQuestions = action.payload
      state = allQuestions.map((question) => ({
        templateQuestionId: question.templateQuestionId,
        questionText: question.questionText,
        templateAnswerId: question.templateAnswerId,
        comments: question.comments,
        answers: question.answers,
        answered: question.answers != null,
        subSection: question.subSection,
        percentages: question.percentages
      }))

      return state
    },
    respondQuestion: (state, action) => {
      const { templateQuestionId, answer, comments, answered = true, percentage } = action.payload
      const questionIndex = state.findIndex((question) => question.templateQuestionId === templateQuestionId)
      if (questionIndex === -1) {
        return
      }
      state[questionIndex] = {
        ...state[questionIndex],
        answers: parseInt(answer),
        comments,
        answered,
        percentages: parseInt(percentage)
      }

      return state
    }
  }
})

export const { storeQuestions, respondQuestion } = questionsSlice.actions

export default questionsSlice.reducer

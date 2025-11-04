import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getQuestions = async ({ packageTemplateId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const params = {
      PackageTemplateId: packageTemplateId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_QUESTIONS_BY_PACKAGE_TEMPLATE_ID, { params })
    const data = response.data
    
    const questions = data.map((item, index) => ({
      templateQuestionId: item.templateQuestionID,
      questionText: item.questionText,
      answers: item.answers,
      comments: item.comments,
      generalComments: item.generalComments,
      customerName: item.customerName,
      flagCAPA: item.flagCAPA,
      templateAnswerId: item.templateAnswerID,
      subSection: item.categ,
      standard: item.standard,
      percentages: item.percentages,
      flag: item.flag,
      index
    }))

    return questions
  } catch (error) {
    console.error(error)
    return new Error('cannot get questions from package template id')
  }
}

export const saveAnswer = async ({ answer, comment, questionId, packageId, flag = 0, percentage }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const body = {
      Answers: parseInt(answer),
      Comments: comment,
      CustomerName: null,
      GeneralComments: null,
      AuditDate: null,
      TemplateAnswerID: parseInt(questionId),
      PackageTemplateID: parseInt(packageId),
      Flag: flag,
      Percentages: percentage != null ? Math.round(percentage) : null
    }

    await axiosInstance.post(ENDPOINTS.SAVE_ANSWER, body, {})
    return null
  } catch (error) {
    return new Error('cannot save question')
  }
}

export const saveGeneralComment = async ({ generalComment, questionId, packageId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const body = {
      Answers: null,
      Comments: null,
      CustomerName: null,
      GeneralComments: generalComment,
      AuditDate: null,
      TemplateAnswerID: null,
      PackageTemplateID: parseInt(packageId),
      Flag: null
    }

    const response = await axiosInstance.post(ENDPOINTS.SAVE_ANSWER, body, {})
    const data = response.data
    return data
  } catch (error) {
    return new Error('cannot save question')
  }
}

export const saveCustomerNameOrAuditDateOrStartOfCareDate = async ({ auditDate, startOfCareDate, customerName, packageId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const body = {
      Answers: null,
      Comments: null,
      CustomerName: customerName,
      GeneralComments: null,
      AuditDate: auditDate,
      StartOfCareDate: startOfCareDate,
      TemplateAnswerID: null,
      PackageTemplateID: parseInt(packageId),
      Flag: null
    }

    const response = await axiosInstance.post(ENDPOINTS.SAVE_ANSWER, body, {})
    const data = response.data
    return data
  } catch (error) {
    return new Error('cannot save customer name or audit date')
  }
}


export const saveEmployeeId = async ({ customerName, packageId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const body = {
      Answers: null,
      Comments: null,
      CustomerName: customerName,
      GeneralComments: null,
      TemplateAnswerID: null,
      PackageTemplateID: parseInt(packageId),
      Flag: null
    }

    const response = await axiosInstance.post(ENDPOINTS.SAVE_ANSWER, body, {})
    const data = response.data
    return data
  } catch (error) {
    return new Error('cannot save question')
  }
}

export const submitAnswers = async ({ packageTemplateId, createdBy }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const body = {
      PackageTemplateID: packageTemplateId,
      CreatedBy: createdBy
    }
    await axiosInstance.post(ENDPOINTS.SUBMIT_ANSWERS, body, body)
    return null
  } catch (error) {
    return new Error('cannot save question')
  }
}

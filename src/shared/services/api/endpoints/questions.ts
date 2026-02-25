import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'

export const getQuestions = async ({ packageTemplateId }: { packageTemplateId: string }) => {
  try {
    const params = {
      PackageTemplateId: packageTemplateId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_QUESTIONS_BY_PACKAGE_TEMPLATE_ID, { params })
    const data = response.data as Array<Record<string, unknown>>

    const questions = data.map((item: Record<string, unknown>, index: number) => ({
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

export const saveAnswer = async ({ answer, comment, questionId, packageId, flag = 0, percentage }: { answer: string | number, comment: string, questionId: string, packageId: string, flag?: number, percentage?: number }) => {
  try {
    const body = {
      Answers: parseInt(String(answer), 10),
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

export const saveGeneralComment = async ({ generalComment, questionId, packageId }: { generalComment: string, questionId: string, packageId: string }) => {
  try {
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

export const saveCustomerNameOrAuditDateOrStartOfCareDate = async ({ auditDate, startOfCareDate, customerName, packageId }: { auditDate: string | null, startOfCareDate: string | null, customerName: string | null, packageId: string }) => {
  try {
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

export const saveEmployeeId = async ({ customerName, packageId }: { customerName: string, packageId: string }) => {
  try {
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

export const submitAnswers = async ({ packageTemplateId, createdBy }: { packageTemplateId: string, createdBy: string }) => {
  try {
    const body = {
      PackageTemplateID: packageTemplateId,
      CreatedBy: createdBy
    }
    await axiosInstance.post(ENDPOINTS.SUBMIT_ANSWERS, body)
    return null
  } catch (error) {
    return new Error('cannot save question')
  }
}

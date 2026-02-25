import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'

export const getMaintenanceBusinessLines = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.MAINTENANCE_BUSINESSLINES)
    if (response.status !== 200) throw new Error('error while getting maintenance business lines')
    const data = response.data as Array<Record<string, unknown>>

    const businessLines = data.map((tool: Record<string, unknown>) => ({
      templateTypeId: tool.templateTypeID,
      templateTypeDesc: tool.templateTypeDesc,
      state: tool.state,
      businessLine: tool.businessLine
    }))

    return businessLines
  } catch (error) {
    console.error(error)
    return new Error('cannot get maintenance business lines')
  }
}

export const getMaintenanceTools = async (templateTypeID: string, state: string) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.MAINTENANCE_TOOLS, {
      params: {
        TemplateTypeID: templateTypeID,
        State: state === '' ? null : state
      }
    })
    if (response.status !== 200) throw new Error('error while getting maintenance tools')
    const data = response.data as Array<Record<string, unknown>>
    const tools = data.map((tool: Record<string, unknown>) => ({
      templateId: tool.templateID,
      templateDesc: tool.templateDesc,
      templateTypeId: tool.templateTypeID,
      releaseDate: tool.releaseDate,
      templateModifiedOn: tool.templateModifiedOn,
      inactiveFlag: tool.inactiveFlag
    }))

    return tools
  } catch (error) {
    console.error(error)
    return new Error('cannot get maintenance tools')
  }
}

export const getTemplateQuestions = async ({ templateId }: { templateId: string }) => {
  try {
    const params = {
      TemplateID: templateId
    }

    const response = await axiosInstance.get(ENDPOINTS.TEMPLATE_QUESTIONS, { params })
    if (response.status !== 200) throw new Error('error while getting template questions')
    const data = response.data as Array<Record<string, unknown>>

    const questions = data.map((question: Record<string, unknown>) => ({
      templateId: question.templateID,
      templateDesc: question.templateDesc,
      templateTypeId: question.templateTypeID,
      state: question.state,
      questionId: question.questionID,
      questionText: question.questionText,
      questionSort: question.questionSort,
      category: question.categ,
      questionStatus: question.questionStatus,
      templateStatus: question.templateStatus,
      questionModifiedOn: question.questionModifiedOn,
      templateModifiedOn: question.templateModifiedOn,
      releaseDate: question.releaseDate,
      keyIndicator: question.keyIndicator
    }))

    return questions
  } catch (error) {
    console.error(error)
    return new Error('cannot get template questions')
  }
}

interface MaintenanceQuestion {
  questionText: string
  questionSort: number
  templateId: string
  category: string
  questionId: string
  releaseDate: string
  keyIndicator: boolean
}

export const updateMaintenanceQuestion = async ({ question, userId }: { question: MaintenanceQuestion, userId: string }) => {
  try {
    const body = {
      ModifiedBy: userId,
      QuestionText: question.questionText,
      QuestionSort: question.questionSort,
      TemplateID: question.templateId,
      Categ: question.category,
      QuestionID: question.questionId,
      ReleaseDate: question.releaseDate,
      KeyIndicator: question.keyIndicator
    }

    const response = await axiosInstance.put(ENDPOINTS.UPDATE_MAINTENANCE_QUESTION, [body], {})
    if (response.status !== 200) throw new Error('error while updating maintenance question')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update maintenance question')
  }
}

export const addTool = async ({ name, userId, templateTypeId, state }: { name: string, userId: string, templateTypeId: string, state: string }) => {
  try {
    const body = {
      TemplateDesc: name,
      TemplateTypeId: templateTypeId,
      CreatedBy: userId,
      ModifiedBy: userId,
      State: state
    }

    const response = await axiosInstance.post(ENDPOINTS.CREATE_TEMPLATE, body, {})
    if (response.status !== 200) throw new Error('error while adding tool')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot add tool')
  }
}

interface AddQuestionItem { name: string, questionSort: number, templateId: string, category: string, isKeyIndicator: boolean }

export const addQuestion = async ({ question, userId }: { question: AddQuestionItem, userId: string }) => {
  try {
    const body = {
      CreatedBy: userId,
      ModifiedBy: userId,
      QuestionText: question.name,
      QuestionSort: question.questionSort,
      TemplateID: question.templateId,
      Categ: question.category,
      KeyIndicator: question.isKeyIndicator ? 1 : 0
    }

    const response = await axiosInstance.post(ENDPOINTS.CREATE_MAINTENANCE_QUESTION, body, {})
    if (response.status !== 200) throw new Error('error while adding question')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot add question')
  }
}

export const deleteQuestion = async ({ questionId, userId }: { questionId: string, userId: string }) => {
  try {
    const body = {
      ModifiedBy: userId,
      QuestionID: questionId,
      InactiveFlag: 1
    }

    const response = await axiosInstance.put(ENDPOINTS.DELETE_TEMPLATE_QUESTION, body, {})
    if (response.status !== 200) throw new Error('error while deleting question')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete question')
  }
}

export const activateQuestion = async ({ questionId, userId }: { questionId: string, userId: string }) => {
  try {
    const body = {
      ModifiedBy: userId,
      QuestionID: questionId,
      InactiveFlag: 0
    }

    const response = await axiosInstance.put(ENDPOINTS.DELETE_TEMPLATE_QUESTION, body, {})
    if (response.status !== 200) throw new Error('error while deleting question')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete question')
  }
}

export const updateTool = async ({ name, templateId, userId }: { name: string, templateId: string, userId: string }) => {
  try {
    const body = {
      TemplateDesc: name,
      TemplateTypeID: 1,
      ModifiedBy: userId,
      TemplateID: templateId,
      Controller: 1,
      InactiveFlag: 0
    }

    const response = await axiosInstance.put(ENDPOINTS.UPDATE_TEMPLATE, body, {})
    if (response.status !== 200) throw new Error('error while updating tool template')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update tool template')
  }
}

interface UpdateQuestionItem {
  questionText: string
  questionSort: number
  templateId: string
  category: string
  questionId: string
  releaseDate: string
}

export const updateAllQuestions = async ({ questions, userId }: { questions: UpdateQuestionItem[], userId: string }) => {
  try {
    const body = questions.map((question) => ({
      ModifiedBy: userId,
      QuestionText: question.questionText,
      QuestionSort: question.questionSort,
      TemplateID: question.templateId,
      Categ: question.category,
      QuestionID: question.questionId,
      ReleaseDate: question.releaseDate
    }))

    const response = await axiosInstance.put(ENDPOINTS.UPDATE_MAINTENANCE_QUESTION, body, {})
    if (response.status !== 200) throw new Error('error while updating maintenance question')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update maintenance question')
  }
}

export const publishToolTemplate = async ({ releaseDate, templateId }: { releaseDate: string, templateId: string }) => {
  try {
    const body = {
      TemplateID: templateId,
      ReleaseDate: releaseDate
    }

    const response = await axiosInstance.post(ENDPOINTS.PUBLISH_TEMPLATE, body, {})
    if (response.status !== 200) throw new Error('error while publishing tool template')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot publish tool template')
  }
}

export const activeOrInactiveTool = async ({ name, templateId, userId, currentInactiveFlag }: { name: string, templateId: string, userId: string, currentInactiveFlag: number }) => {
  try {
    const body = {
      TemplateDesc: name,
      TemplateTypeID: 1,
      ModifiedBy: userId,
      TemplateID: templateId,
      Controller: 2,
      InactiveFlag: currentInactiveFlag === 1 ? 0 : 1
    }

    const response = await axiosInstance.put(ENDPOINTS.UPDATE_TEMPLATE, body, {})
    if (response.status !== 200) throw new Error('error while deleting tool template')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete tool')
  }
}

export const updateSubsection = async ({ templateId, userId, oldName, newName }: { templateId: string, userId: string, oldName: string, newName: string }) => {
  try {
    const body = {
      ModifiedBy: userId,
      TemplateID: templateId,
      OldCategory: oldName,
      NewCategory: newName,
      Controller: 1
    }
    const response = await axiosInstance.put(ENDPOINTS.UPDATE_SUBSECTION, body, {})
    if (response.status !== 200) throw new Error('error while updating subsection')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update subsection')
  }
}

export const deleteSubsection = async ({ templateId, userId, name }: { templateId: string, userId: string, name: string }) => {
  try {
    const body = {
      ModifiedBy: userId,
      TemplateID: templateId,
      OldCategory: name,
      NewCategory: name,
      Controller: 0
    }
    const response = await axiosInstance.put(ENDPOINTS.UPDATE_SUBSECTION, body, {})
    if (response.status !== 200) throw new Error('error while updating subsection')
    const data = response.data

    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot update subsection')
  }
}

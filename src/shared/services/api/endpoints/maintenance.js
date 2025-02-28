import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const getMaintenanceBusinessLines = async () => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const response = await axiosInstance.get(ENDPOINTS.MAINTENANCE_BUSINESSLINES)
    if (response.status !== 200) throw new Error('error while getting maintenance business lines')
    const data = response.data

    const businessLines = data.map((tool) => ({
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

export const getMaintenanceTools = async (templateTypeID, state) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const response = await axiosInstance.get(ENDPOINTS.MAINTENANCE_TOOLS, {
      params: {
        TemplateTypeID: templateTypeID,
        State: state === '' ? null : state
      }
    })
    if (response.status !== 200) throw new Error('error while getting maintenance tools')
    const data = response.data

    const tools = data.map((tool) => ({
      templateId: tool.templateID,
      templateDesc: tool.templateDesc,
      templateTypeId: tool.templateTypeID,
      releaseDate: tool.releaseDate,
      templateModifiedOn: tool.templateModifiedOn,
    }))

    return tools
  } catch (error) {
    console.error(error)
    return new Error('cannot get maintenance tools')
  }
}


export const getTemplateQuestions = async ({ templateId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const params = {
      TemplateID: templateId
    }

    const response = await axiosInstance.get(ENDPOINTS.TEMPLATE_QUESTIONS, { params })
    if (response.status !== 200) throw new Error('error while getting template questions')
    const data = response.data

    const questions = data.map((question) => ({
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
      releaseDate: question.releaseDate
    }))

    return questions
  } catch (error) {
    console.error(error)
    return new Error('cannot get template questions')
  }
}

export const updateMaintenanceQuestion = async ({ question, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      ModifiedBy: userId,
      QuestionText: question.questionText,
      QuestionSort: question.questionSort,
      TemplateID: question.templateId,
      Categ: question.category,
      QuestionID: question.questionId,
      ReleaseDate: question.releaseDate
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

export const addTool = async ({ name, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      TemplateDesc: name,
      CreatedBy: userId,
      ModifiedBy: userId
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

export const addQuestion = async ({ question, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const body = {
      CreatedBy: userId,
      ModifiedBy: userId,
      QuestionText: question.name,
      QuestionSort: question.questionSort,
      TemplateID: question.templateId,
      Categ: question.category,
      ReleaseDate: new Date()
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

export const deleteQuestion = async ({ questionId, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

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

export const activateQuestion = async ({ questionId, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

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

export const updateTool = async ({ name, templateId, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const body = {
      TemplateDesc: name,
      TemplateTypeID: 1,
      ModifiedBy: userId,
      TemplateID: templateId,
      Controller: 1
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

export const updateAllQuestions = async ({ questions, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
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

export const publishToolTemplate = async ({ releaseDate, templateId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
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

export const deleteTool = async ({ name, templateId, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
    const body = {
      TemplateDesc: name,
      TemplateTypeID: 1,
      ModifiedBy: userId,
      TemplateID: templateId,
      Controller: 0
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

export const updateSubsection = async ({ templateId, userId, oldName, newName }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
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

export const deleteSubsection = async ({ templateId, userId, name }) => {
  try {
    const axiosInstance = apiMaster.getInstance()
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

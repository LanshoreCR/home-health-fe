import apiMaster from '../api-master'
import { ENDPOINTS } from '../config'

export const uploadAttachment = async ({ packageId, folderId, file, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const filesToUpload = file.map((file) => ({
      folderID: folderId,
      packageID: parseInt(packageId),
      fileName: file.name,
      fileBase64: file.src,
      fileType: file.type,
      createdBy: userId,
      tags: file.tags,
      comments: file.comments
    }))

    const response = await axiosInstance.post(ENDPOINTS.UPLOAD_ATTACHMENT, filesToUpload, {})
    if (response.status !== 200) return new Error('error saving attachment to the database')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot upload attachment')
  }
}

export const getAttachments = async ({ packageId, userId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const params = {
      PackageID: packageId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_ATTACHMENTS, { params })
    if (response.status !== 200) return new Error('error getting attachments')
    const data = response.data
    console.log("🚀 ~ getAttachments ~ data:", data)

    const attachments = data.map((item) => ({
      packageId: item.packageID,
      recordId: item.recordID,
      fileId: item.fileID,
      fileName: item.fileName,
      downloadLink: item.downloadLink,
      siteId: item.siteID
    }))

    return attachments
  } catch (error) {
    console.error(error)
    return new Error('cannot get attachments')
  }
}

export const downloadAttachment = async ({ attachmentId }) => {
  try {
    const axiosInstance = apiMaster.getInstance()

    const params = {
      fileID: attachmentId
    }

    const response = await axiosInstance.get(ENDPOINTS.DOWNLOAD_ATTACHMENT, { params })
    if (response.status !== 200) return new Error('error downloading attachment')
    const data = response.data

    const fileBase64 = data.fileType === 'image/png' || data.fileType === 'image/jpg' || data.fileType === 'image/jpeg'
      ? `data:image/${data.fileType};base64,${data.fileBase64String}`
      : `data:${data.fileType};base64,${data.fileBase64String}`

    const attachment = {
      src: fileBase64,
      name: data.fileName,
      type: data.fileType
    }

    return attachment
  } catch (error) {
    console.error(error)
    return new Error('cannot download attachment')
  }
}

export const deleteAttachment = async ({ file, userId }) => {
  console.log("🚀 ~ deleteAttachment ~ file:", file)
  try {
    const axiosInstance = apiMaster.getInstance()

    const { recordId, packageId, fileId, fileName, siteId, downloadLink } = file

    const params = {
      RecordID: recordId,
      PackageID: packageId,
      FileID: fileId,
      FileName: fileName,
      SiteID: siteId,
      DownloadLink: downloadLink,
      Controller: 1
    }

    const response = await axiosInstance.put(ENDPOINTS.DELETE_ATTACHMENT, params, {})
    if (response.status !== 200) return new Error('error deleting attachment')
    const data = response.data
    return data
  } catch (error) {
    console.error(error)
    return new Error('cannot delete attachment')
  }
}

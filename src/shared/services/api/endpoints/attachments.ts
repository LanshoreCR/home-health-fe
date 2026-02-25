import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'

interface FileUploadItem {
  name: string
  src: string
  type: string
  tags?: unknown
  comments?: string
}

interface UploadAttachmentParams {
  packageId: string
  folderId: string
  file: FileUploadItem[]
  userId: string
}

export const uploadAttachment = async ({ packageId, folderId, file, userId }: UploadAttachmentParams) => {
  try {
    const filesToUpload = file.map((f: FileUploadItem) => ({
      folderID: folderId,
      packageID: parseInt(packageId, 10),
      fileName: f.name,
      fileBase64: f.src,
      fileType: f.type,
      createdBy: userId,
      tags: f.tags,
      comments: f.comments
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

export const getAttachments = async ({ packageId }: { packageId: string }) => {
  try {
    const params = {
      PackageID: packageId
    }

    const response = await axiosInstance.get(ENDPOINTS.GET_ATTACHMENTS, { params })
    if (response.status !== 200) return new Error('error getting attachments')
    const data = response.data as Array<Record<string, unknown>>
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

export const downloadAttachment = async ({ attachmentId }: { attachmentId: string }) => {
  try {
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

interface DeleteAttachmentFile {
  recordId: string
  packageId: string
  fileId: string
  fileName: string
  siteId: string
  downloadLink: string
}

export const deleteAttachment = async ({ file, userId }: { file: DeleteAttachmentFile, userId: string }) => {
  try {
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

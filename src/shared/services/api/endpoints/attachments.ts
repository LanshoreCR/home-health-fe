import { toast } from 'sonner'
import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'

export interface AttachmentInfo {
  fileId: string
  fileName: string
  fileType?: string
  size?: number
  modifiedDateTime?: string
}

export interface DownloadedAttachment {
  src: string
  name: string
  type: string
}

export interface UploadAttachmentParams {
  packageId: number
  fileName: string
  fileBase64: string
  fileType?: string
}

export const uploadAttachment = async (params: UploadAttachmentParams): Promise<void> => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.ATTACHMENT_UPLOAD, params)
    if (response.status !== 200) {
      toast.error('Failed to upload attachment')
      throw new Error('Failed to upload attachment')
    }
  } catch (error) {
    console.error(error)
    toast.error('Failed to upload attachment')
    throw error
  }
}

export const getAttachmentsByPackageId = async (packageId: number): Promise<AttachmentInfo[]> => {
  try {
    const response = await axiosInstance.get(`${ENDPOINTS.ATTACHMENT_LIST}/${packageId}`)
    if (response.status !== 200) {
      toast.error('Failed to load attachments')
      throw new Error('Failed to load attachments')
    }
    return (response.data.attachments ?? []) as AttachmentInfo[]
  } catch (error) {
    console.error(error)
    toast.error('Failed to load attachments')
    throw error
  }
}

export const downloadAttachment = async (fileId: string): Promise<DownloadedAttachment> => {
  try {
    const response = await axiosInstance.get(`${ENDPOINTS.ATTACHMENT_DOWNLOAD}/${fileId}`)
    if (response.status !== 200) {
      toast.error('Failed to download attachment')
      throw new Error('Failed to download attachment')
    }
    const data = response.data as { fileBase64: string; fileName: string; fileType: string }
    const src = data.fileBase64.startsWith('data:')
      ? data.fileBase64
      : `data:${data.fileType};base64,${data.fileBase64}`
    return { src, name: data.fileName, type: data.fileType }
  } catch (error) {
    console.error(error)
    toast.error('Failed to download attachment')
    throw error
  }
}

export const deleteAttachment = async (fileId: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`${ENDPOINTS.ATTACHMENT_DELETE}/${fileId}`)
    if (response.status !== 200) {
      toast.error('Failed to delete attachment')
      throw new Error('Failed to delete attachment')
    }
  } catch (error) {
    console.error(error)
    toast.error('Failed to delete attachment')
    throw error
  }
}

import { Button, Chip, CircularProgress, FormControl, Grid, IconButton, ImageListItem, Modal, Paper, TextField } from '@mui/material'
import { deleteAttachment, downloadAttachment, getAttachments, uploadAttachment } from '../../shared/services/api/endpoints/attachments'
import { getAudit } from '../../shared/services/api/endpoints/audit'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import DeleteIcon from '@mui/icons-material/Delete'

export default function AttachmentsPage() {
  const { id } = useParams()

  const user = useSelector((state) => state.user)

  const [currentAudit, setCurrentAudit] = useState(null)
  const [attachments, setAttachments] = useState([])

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [comments, setComments] = useState('')
  const [currentFile, setCurrentFile] = useState([])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const newTag = inputValue.trim()
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      setInputValue('')
    }
  }

  const handleChangeComments = (event) => {
    setComments(event.target.value)
  }

  const handleDelete = (tagToDelete) => () => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete))
  }

  const handleChangeModal = () => {
    if (modalIsOpen === true) {
      setCurrentFile([])
    }
    setModalIsOpen(!modalIsOpen)
  }

  const navigate = useNavigate()

  const handleUpload = (event) => {
    event.preventDefault()
    if (!event.target.files) return

    const filesArray = Array.from(event.target.files)

    for (const newFile of filesArray) {
      if (newFile == null) return

      const file = {
        name: newFile.name,
        comments: '',
        tags: []
      }

      if (newFile.type === 'image/png' || newFile.type === 'image/jpg' || newFile.type === 'image/jpeg') {
        file.type = 'image'
      } else {
        file.type = 'file'
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        file.src = reader.result
        setCurrentFile((currentFiles) => [...currentFiles, file])
      }
      reader.readAsDataURL(newFile)
    }
    setModalIsOpen(true)

    if (currentFile.length > 0) {
      setModalIsOpen(true)
      setTags([])
      setComments('')
    }
  }

  const goToCamera = () => {
    const url = `/${id}/camera`
    navigate(url, { replace: true })
  }

  const handleSave = async () => {
    if (currentFile == null) return
    setIsLoading(true)
    const filesToUpload = currentFile.map((file) => ({
      ...file,
      tags,
      comments
    }))
    const response = await uploadAttachment({ packageId: id, folderId: currentAudit.folderId, file: filesToUpload, userId: user.employeeId })
    if (response instanceof Error) {
      toast.error('error while uploading attachment')
      return
    }
    setIsLoading(false)
    toast.success('attachment uploaded successfully')
    setCurrentFile(null)
    setTags([])
    setComments('')
    setModalIsOpen(false)
    const newAttachmentsList = await getAttachments({ packageId: id, userId: user.employeeId })
    if (newAttachmentsList instanceof Error) {
      toast.error('error getting attachments')
      return
    }
    setAttachments(newAttachmentsList)
  }

  const handleDownload = (attachmentId) => async () => {
    const response = await downloadAttachment({ attachmentId })
    if (response instanceof Error) {
      toast.error('error downloading attachment')
      return
    }
    const fileBase64 = response.src
    const fileName = response.name
    const link = document.createElement('a')
    link.href = fileBase64
    link.download = fileName
    link.click()
  }

  const handleDeleteAttachment = async (file) => {
    const userId = user.employeeId
    const response = await deleteAttachment({ file, userId })
    if (response instanceof Error) {
      toast.error('error deleting attachment')
      return
    }
    toast.success('attachment deleted successfully')
    const newAttachmentsList = await getAttachments({ packageId: id, userId: user.employeeId })
    if (newAttachmentsList instanceof Error) {
      toast.error('error getting attachments')
      return
    }
    setAttachments(newAttachmentsList)
  }

  useEffect(() => {
    getAudit({ id })
      .then((data) => {
        if (data == null) {
          throw new Error('cannot getting audit tools')
        }
        console.log("🚀 ~ .then ~ data:", data)
        setCurrentAudit(data)
      })
  }, [id])

  useEffect(() => {
    getAttachments({ packageId: id, userId: user.employeeId })
      .then((data) => {
        if (data instanceof Error) {
          throw new Error('cannot getting audit tools')
        }
        setAttachments(data)
      })
      .catch(() => {
        toast.error('error getting audit tools')
      })
  }, [id, user.employeeId])

  return (
    <section className="flex flex-col items-center justify-center p-4">
      {attachments.length > 0
        ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Button
                className='w-full h-full max-h-[125px]'
                fullWidth
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<UploadFileIcon />}>
                Upload file
                <input type='file' className='hidden' multiple onChange={handleUpload} />
              </Button>
            </Grid>
            {attachments.map((file) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={file.fileId}>
                <ImageListItem className='flex flex-col'>
                  {file.src
                    ? (
                      <img
                        src={file.src}
                        alt={file.fileName}
                        loading="lazy"
                        className='rounded-lg'
                      />
                    )
                    : (
                      <div className='relative rounded-lg bg-gray-200 flex flex-col justify-center items-center truncate cursor-pointer sm:h-[218px] md:h-[190px] lg:h-[215px] xl:h-[132px]'>
                        <span className='text-center p-2 text-balance'>
                          {file.fileName}
                        </span>
                        <div className='flex w-full items-center gap-x-2 justify-center'>
                          <IconButton onClick={handleDownload(file.fileId)}>
                            <FileDownloadIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteAttachment(file)}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    )}

                  {/* <div className='flex flex-wrap justify-center mt-2 gap-1'>
                    {file.tags != null && file.tags.map((tag) => (
                      <Chip size='small'
                        key={tag}
                        label={tag}
                      />
                    ))}
                  </div> */}
                </ImageListItem>
              </Grid>
            ))}
          </Grid>
        )
        : (
          <div className='flex flex-col items-center justify-center gap-y-4'>
            <h3 className='text-center font-bold'>No attachments to show</h3>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}>
              Upload file
              <input type='file' className='hidden' multiple onChange={handleUpload} />
            </Button>
          </div>
        )}
      <Modal
        open={modalIsOpen}
        onClose={handleChangeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:max-w-3xl max-w-xl w-full p-6 pb-10'>
          {currentFile != null && (
            <>
              <div className='flex w-full justify-between gap-x-5 flex-col'>
                <Grid container spacing={2} className='mb-4'>
                  {currentFile.length > 0 && currentFile.map((file) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={file.fileId}>
                      {file.type === 'image' && file.src
                        ? (
                          <img
                            src={file.src}
                            alt={file.name}
                            loading="lazy"
                            className='md:max-w-44 max-w-28 h-auto rounded-md max-h-[150px]'
                          />
                        )
                        : (
                          <div className='md:max-w-44 max-w-28 h-auto rounded-md max-h-[150px] flex items-center justify-center bg-gray-200 p-4'>
                            {file.name}
                          </div>
                        )}

                    </Grid>
                  ))}
                </Grid>
                {isLoading && <footer className='flex justify-center items-center my-4 w-full flex-col gap-y-2'>
                  <CircularProgress />
                  <span className='text-center text-blue-600'>uploading...</span>
                </footer>}
                <div className='flex flex-col gap-y-2 w-full'>
                  {/* <div className='flex gap-y-2 flex-col mb-3'>
                    <FormControl fullWidth>
                      <TextField variant='outlined' label='Comment' disabled={isLoading}
                        value={comments}
                        onChange={handleChangeComments}
                        placeholder='Add a comment' size='small' multiline minRows={2} maxRows={3} />
                    </FormControl>
                  </div> */}
                  {/* <div className='flex flex-col w-full'>
                    <TextField
                      size='small'
                      variant="outlined"
                      placeholder="Add a tag"
                      label="Tags"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      fullWidth
                      disabled={isLoading}
                    />
                    <div className='flex flex-col mt-2 gap-y-2'>
                      {tags.map((tag, index) => (
                        <Chip
                          size='small'
                          key={index}
                          label={tag}
                          onDelete={handleDelete(tag)}
                        />
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
              <div className='flex flex-col gap-y-2 w-full mt-4'>
                <Button variant='contained' color='primary' disabled={isLoading} onClick={handleSave}>Save</Button>
              </div>
            </>
          )}
        </Paper>
      </Modal>
      <section className='mt-4 fixed bottom-0 left-0 right-0 mb-5 flex justify-center items-center'>
        <button onClick={goToCamera} className='bg-primary text-white px-4 py-2 rounded-full w-16 h-16 flex items-center justify-center'>
          <CameraAltIcon />
        </button>
      </section>
    </section>
  )
}

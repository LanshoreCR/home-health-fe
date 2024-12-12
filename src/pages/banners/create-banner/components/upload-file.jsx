import { useState } from 'react'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Chip from '@mui/material/Chip'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

export default function UploadFile() {
  const [files, setFiles] = useState([])

  const handleUpload = (event) => {
    if (!event.target.files) return
    const newFile = event.target.files[0]
    if (newFile == null) return

    setFiles((files) => [...files, newFile])
  }

  const handleRemove = (fileToRemove) => {
    const newFileArray = files.filter((file) => file !== fileToRemove)
    setFiles(newFileArray)
  }

  return (
    <>
      <Button
        fullWidth
        component="label"
        role={undefined}
        variant="outlined"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <input type='file' className='hidden' onChange={handleUpload} />
      </Button>
      {
        files.length > 0
          ? <ul className='mt-2'>
            {files.map((file) =>
              <li key={file.lastModified} className='mb-2'>
                <Chip label={file.name} icon={<InsertDriveFileIcon />} onDelete={() => handleRemove(file)} />
              </li>
            )}
          </ul>
          : <span className='text-gray-400 text-center mt-2 text-sm'>No attachments to show</span>
      }
    </>
  )
}

import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'
import EditSubsectionModal from './edit-subsection-modal'
import { deleteSubsection } from '../../../shared/services/api/endpoints/maintenance'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

export default function SidebarMaintenanceRow({ item, isActive, onChange, handleRemoveTool, sections, reRenderTools }) {
  const { name } = item

  const user = useSelector((state) => state.user)
  const userId = user.employeeId

  const [showSubSections, setShowSubSections] = useState(false)
  const handleHideShowSubSections = () => {
    setShowSubSections(!showSubSections)
  }

  const handleDeleteSubsection = async (name) => {
    const response = await deleteSubsection({ templateId: item.templateId, userId, name })
    if (response instanceof Error) {
      toast.error('Error while deleting subsection')
      return
    }
    toast.success('Subsection deleted successfully')
    reRenderTools()
  }

  if (isActive) {
    return (
      <li className='rounded-lg p-3 bg-primary flex justify-between items-start cursor-pointer flex-col' onClick={onChange}>
        <header className='flex items-center justify-between gap-x-3 w-full'>
          <span>{name}</span>
          <footer>
            <IconButton size='small' onClick={handleHideShowSubSections}>
              {showSubSections ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
            <IconButton type='button' size='small' onClick={handleRemoveTool}>
              <DeleteIcon />
            </IconButton>
          </footer>
        </header>
        {showSubSections &&
          <ul className='flex flex-col gap-y-3 my-3 w-full'>
            {sections.length > 0 && sections.map((subSection) => (
              <li className='flex items-center justify-between bg-blue-300/40
            hover:bg-blue-100 cursor-pointer mx-3 p-2 rounded-lg'
                key={subSection}>
                <span className='text-sm'>{subSection}</span>
                <div className='flex gap-x-2'>
                  <EditSubsectionModal
                    oldName={subSection}
                    templateId={item.templateId}
                    reRenderTools={reRenderTools}
                  />
                  <IconButton onClick={() => handleDeleteSubsection(subSection)}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        }
      </li>
    )
  }

  return (
    <li className='rounded-lg p-3 flex justify-between items-center hover:bg-blue-100 cursor-pointer' onClick={onChange}>
      <span>{name}</span>
    </li>
  )
}

import { useState } from 'react'
import { IconButton } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Chip from '@mui/material/Chip'
import { useSelector } from 'react-redux'

const getStatsBySubsection = (questions, subSection) => {
  const completedCount = questions.filter((question) => question.subSection === subSection && question.answered).length
  const totalCount = questions.filter((question) => question.subSection === subSection).length
  return { completedCount, totalCount }
}

export default function SidebarToolRow({ item, onChange, isActive, subSections, refs }) {
  const { templateName, templateStatus } = item

  const [showSubSections, setShowSubSections] = useState(false)
  const handleHideShowSubSections = () => {
    setShowSubSections(!showSubSections)
  }

  const storedQuestions = useSelector((state) => state.questions)

  if (isActive) {
    return (
      <li className='rounded-lg p-3 bg-primary/90 flex justify-between items-center cursor-pointer flex-col' onClick={onChange}>
        <header className='flex items-center justify-between gap-x-3'>
          <span className=''>{templateName}</span>
          <Chip label={templateStatus} size="small" />
          <IconButton size='small' onClick={handleHideShowSubSections}>
            {showSubSections ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </header>
        {showSubSections &&
          <ul className='flex flex-col gap-y-3 my-3'>
            {subSections.length > 0 && subSections.map((subSection) => {
              const { completedCount, totalCount } = getStatsBySubsection(storedQuestions, subSection)
              return (
                <li className='flex items-center justify-between bg-blue-300/40
                hover:bg-blue-100 cursor-pointer mx-3 p-2 rounded-lg'
                  key={subSection}
                  onClick={() => refs.current[subSection].scrollIntoView({ behavior: 'smooth' })}>
                  <span className='text-sm'>{subSection}</span>
                  <Chip label={`${completedCount}/${totalCount}`} size="small" />
                </li>
              )
            })}
          </ul>
        }
      </li>
    )
  }

  return (
    <li className='rounded-lg p-3 flex justify-between items-center hover:bg-blue-50 cursor-pointer' onClick={onChange}>
      <span>{templateName}</span>
      <Chip label={templateStatus} size="small" />
    </li>
  )
}

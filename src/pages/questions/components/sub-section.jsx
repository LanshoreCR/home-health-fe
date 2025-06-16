
import Divider from '@mui/material/Divider'
import QuestionCard from './question-card'
import { useSelector } from 'react-redux'


export default function SubSection({ subSection, questions, sectionId, ref, refs, isApproved, currentTool }) {

  const storeQuestions = useSelector((state) => state.questions)
  const questionsBySubSection = storeQuestions.filter((question) => question.subSection === subSection)
  const completedCount = questionsBySubSection.filter((question) => question.answered).length
  const totalCount = questionsBySubSection.length


  return (
    <article className='flex flex-col w-full gap-y-5'>
      <Divider ref={ref} >
        <div className='flex flex-col'>
          <span className='text-xs text-gray-500'>{`${subSection} ${completedCount}/${totalCount}`}</span>
        </div>
      </Divider>
      {
        questions.map((question, index) => (
          <div key={question.standard}>
            <div ref={(el) => (refs.current[question.templateQuestionId] = el)}></div>
            <div ref={(el) => (refs.current[question.standard] = el)}></div>
            <QuestionCard
              key={question.templateQuestionId}
              question={question}
              sectionId={sectionId}
              initAnswer={storeQuestions.find((q) => q.templateQuestionId === question.templateQuestionId)?.answers}
              initPercentage={storeQuestions.find((q) => q.templateQuestionId === question.templateQuestionId)?.percentages}
              index={index + 1}
              isApproved={isApproved}
              currentTool={currentTool}
            />
          </div>
        ))
      }
    </article>
  )
}

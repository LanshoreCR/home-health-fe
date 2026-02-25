import { useParams } from 'react-router-dom'
import { AuditForm } from '@/components/audit-form'
import { auditDatabase, toolListMap, generateFallbackTool } from '@/mocks'

export default function AuditQuestionsPage () {
  const { id, toolId } = useParams<{ id: string, toolId: string }>()

  if (id === undefined || toolId === undefined) {
    return null
  }

  const auditDef = auditDatabase[id]
  const allTools = toolListMap[id] ?? toolListMap['1']

  const auditTitle = auditDef?.title ?? 'Audit'
  const auditLocation = auditDef?.location ?? ''
  const auditStatus = auditDef?.status ?? 'Pending'

  const toolDef = auditDef?.tools?.[toolId]
  const sections = toolDef?.sections ?? generateFallbackTool(toolId).sections

  return (
    <AuditForm
      audit={{
        auditId: id,
        title: auditTitle,
        location: auditLocation,
        status: auditStatus
      }}
      toolId={toolId}
      allTools={allTools}
      sections={sections}
    />
  )
}

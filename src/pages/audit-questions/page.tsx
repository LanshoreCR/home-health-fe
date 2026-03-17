import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuditForm, type ToolDetailsForDisplay } from '@/components/audit-form'
import { auditDatabase, toolListMap, generateFallbackTool } from '@/mocks'
import {
  getToolsByAuditPackageId,
  getToolById,
  getToolForm,
  mapToolByIdToToolMetadata,
  mapFormQuestionsToSections
} from '@shared/services/api/endpoints/tools'
import type { ToolInfo, ToolMetadata, SectionData } from '@shared/types'

export default function AuditQuestionsPage () {
  const { id, toolId } = useParams<{ id: string, toolId: string }>()
  const [allTools, setAllTools] = useState<ToolInfo[]>([])
  const [toolsLoading, setToolsLoading] = useState(true)
  const [toolsError, setToolsError] = useState<string | null>(null)
  const [toolDetails, setToolDetails] = useState<ToolDetailsForDisplay | null>(null)
  const [initialToolMetadata, setInitialToolMetadata] = useState<ToolMetadata | null>(null)
  const [sections, setSections] = useState<SectionData[]>([])
  const [formLoading, setFormLoading] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)

  if (id === undefined || toolId === undefined) {
    return null
  }

  const auditDef = auditDatabase[id]
  const auditTitle = auditDef?.title ?? 'Audit'
  const auditLocation = auditDef?.location ?? ''
  const auditStatus = auditDef?.status ?? 'Pending'
  const fallbackTools = toolListMap[id] ?? toolListMap['1'] ?? []
  const fallbackSections = useMemo(() => generateFallbackTool(toolId).sections, [toolId])

  useEffect(() => {
    setToolsLoading(true)
    setToolsError(null)
    getToolsByAuditPackageId(id)
      .then(setAllTools)
      .catch((err) => setToolsError(err instanceof Error ? err.message : 'Failed to load tools'))
      .finally(() => setToolsLoading(false))
  }, [id])

  useEffect(() => {
    if (!toolId) return
    setFormLoading(true)
    setFormError(null)
    Promise.all([getToolById(toolId), getToolForm(toolId)])
      .then(([tool, formQuestions]) => {
        setToolDetails({
          templateName: tool.templateDesc ?? '',
          locationName: tool.locationName ?? '',
          assignedAuditor: tool.auditorName ?? ''
        })
        setInitialToolMetadata(mapToolByIdToToolMetadata(tool))
        setSections(mapFormQuestionsToSections(formQuestions))
      })
      .catch((err) => {
        setFormError(err instanceof Error ? err.message : 'Failed to load tool or form')
        setSections(fallbackSections)
      })
      .finally(() => setFormLoading(false))
  }, [toolId])

  const tools = allTools.length > 0 ? allTools : fallbackTools
  const displaySections = sections.length > 0 ? sections : fallbackSections

  return (
    <AuditForm
      audit={{
        auditId: id,
        title: auditTitle,
        location: auditLocation,
        status: auditStatus
      }}
      toolId={toolId}
      allTools={tools}
      sections={displaySections}
      toolDetails={toolDetails}
      initialToolMetadata={initialToolMetadata ?? undefined}
      formLoading={formLoading}
      formError={formError}
    />
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuditForm, type ToolDetailsForDisplay } from '@/components/audit-form'
import { auditDatabase, toolListMap, generateFallbackQuestions } from '@/mocks'
import {
  getToolsByAuditPackageId,
  getToolById,
  getToolForm,
  mapToolByIdToToolMetadata,
  mapFormQuestions
} from '@shared/services/api/endpoints/tools'
import { useFormStore } from '@/stores/useFormStore'
import type { ToolInfo, ToolMetadata } from '@shared/types'

export default function AuditQuestionsPage () {
  const { id, toolId } = useParams<{ id: string, toolId: string }>()
  const [allTools, setAllTools] = useState<ToolInfo[]>([])
  const [toolsLoading, setToolsLoading] = useState(true)
  const [toolsError, setToolsError] = useState<string | null>(null)
  const [toolDetails, setToolDetails] = useState<ToolDetailsForDisplay | null>(null)
  const [initialToolMetadata, setInitialToolMetadata] = useState<ToolMetadata | null>(null)
  const [formLoading, setFormLoading] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)
  const initializeForm = useFormStore((s) => s.initialize)

  if (id === undefined || toolId === undefined) {
    return null
  }

  const auditDef = auditDatabase[id]
  const auditTitle = auditDef?.title ?? 'Audit'
  const auditLocation = auditDef?.location ?? ''
  const auditStatus = auditDef?.status ?? 'Pending'
  const fallbackTools = toolListMap[id] ?? toolListMap['1'] ?? []
  const fallbackQuestions = useMemo(() => generateFallbackQuestions(toolId), [toolId])

  useEffect(() => {
    setToolsLoading(true)
    setToolsError(null)
    getToolsByAuditPackageId(id)
      .then(setAllTools)
      .catch((err) => setToolsError(err instanceof Error ? err.message : 'Failed to load tools'))
      .finally(() => setToolsLoading(false))
  }, [id])

  const formRequestId = useRef(0)

  useEffect(() => {
    if (!toolId) return
    const requestId = ++formRequestId.current
    setFormLoading(true)
    setFormError(null)
    Promise.all([getToolById(toolId), getToolForm(toolId)])
      .then(([tool, formQuestions]) => {
        if (requestId !== formRequestId.current) return
        setToolDetails({
          templateName: tool.templateDesc ?? '',
          locationName: tool.locationName ?? '',
          assignedAuditor: tool.auditorName ?? ''
        })
        setInitialToolMetadata(mapToolByIdToToolMetadata(tool))
        const mappedQuestions = mapFormQuestions(formQuestions)
        initializeForm(toolId, mappedQuestions)
      })
      .catch((err) => {
        if (requestId !== formRequestId.current) return
        setFormError(err instanceof Error ? err.message : 'Failed to load tool or form')
        initializeForm(toolId, fallbackQuestions)
      })
      .finally(() => {
        if (requestId !== formRequestId.current) return
        setFormLoading(false)
      })
  }, [toolId])

  const tools = allTools.length > 0 ? allTools : fallbackTools

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
      toolDetails={toolDetails}
      initialToolMetadata={initialToolMetadata ?? undefined}
      formLoading={formLoading}
      formError={formError}
    />
  )
}

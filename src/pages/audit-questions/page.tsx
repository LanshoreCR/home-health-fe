import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AuditForm, type ToolDetailsForDisplay } from '@/components/audit-form'
import { auditDatabase, toolListMap, generateFallbackQuestions } from '@/mocks'
import {
  getToolsByAuditPackageId,
  getToolById,
  getToolForm,
  updateToolMetadata,
  updateToolGeneralComments,
  mapToolMetadataToUpdatePayload,
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
  const [initialGeneralComments, setInitialGeneralComments] = useState('')
  const [isSavingMetadata, setIsSavingMetadata] = useState(false)
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
    // Reset comments immediately on tool switch; replaced by fetched value when available.
    setInitialGeneralComments('')
    Promise.all([getToolById(toolId), getToolForm(toolId)])
      .then(([tool, formQuestions]) => {
        if (requestId !== formRequestId.current) return
        setToolDetails({
          templateName: tool.templateDesc ?? '',
          locationName: tool.locationName ?? '',
          assignedAuditor: tool.auditorName ?? ''
        })
        setInitialToolMetadata(mapToolByIdToToolMetadata(tool))
        setInitialGeneralComments(tool.generalComments ?? '')
        const mappedQuestions = mapFormQuestions(formQuestions)
        initializeForm(toolId, mappedQuestions)
      })
      .catch((err) => {
        if (requestId !== formRequestId.current) return
        setFormError(err instanceof Error ? err.message : 'Failed to load tool or form')
        setInitialGeneralComments('')
        initializeForm(toolId, fallbackQuestions)
      })
      .finally(() => {
        if (requestId !== formRequestId.current) return
        setFormLoading(false)
      })
  }, [toolId])

  const tools = allTools.length > 0 ? allTools : fallbackTools

  const handleSaveToolMetadata = async (metadata: ToolMetadata) => {
    setIsSavingMetadata(true)
    try {
      const payload = mapToolMetadataToUpdatePayload(metadata)
      await updateToolMetadata(toolId, payload)
      const tool = await getToolById(toolId)
      setToolDetails({
        templateName: tool.templateDesc ?? '',
        locationName: tool.locationName ?? '',
        assignedAuditor: tool.auditorName ?? ''
      })
      setInitialToolMetadata(mapToolByIdToToolMetadata(tool))
      setInitialGeneralComments(tool.generalComments ?? '')
      toast.success('Tool details saved')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save tool details')
    } finally {
      setIsSavingMetadata(false)
    }
  }

  const handleSaveGeneralComments = (text: string) => {
    void updateToolGeneralComments(toolId, text).catch((error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to save general comments')
    })
  }

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
      initialGeneralComments={initialGeneralComments}
      onSaveToolMetadata={handleSaveToolMetadata}
      onSaveGeneralComments={handleSaveGeneralComments}
      isSavingMetadata={isSavingMetadata}
      formLoading={formLoading}
      formError={formError}
    />
  )
}

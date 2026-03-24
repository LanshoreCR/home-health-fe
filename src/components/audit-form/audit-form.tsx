import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AuditQuestion } from '@/components/audit-question'
import { AuditProgressPanel } from '@/components/audit-progress-panel'
import type { ToolInfo, QuestionFilter, AuditFormContext, ToolMetadata } from '@/shared/types'
import { useToolNavigation } from '@/hooks/useToolNavigation'
import { useFilteredQuestions } from '@/hooks/useFilteredQuestions'
import { useAuditProgress } from '@/hooks/useAuditProgress'
import { useFormStore } from '@/stores/useFormStore'
import { submitAnswers } from '@shared/services/api/endpoints/questions'
import { AuditFormHeader } from './audit-form-header'
import { ToolNavigationBar } from './tool-navigation-bar'
import { ToolDropdown } from './tool-dropdown'
import { ToolMetadataPanel } from './tool-metadata-panel'

export interface ToolDetailsForDisplay {
  templateName: string
  locationName: string
  assignedAuditor: string
}

interface AuditFormProps {
  audit: AuditFormContext
  toolId: string
  allTools: ToolInfo[]
  toolDetails?: ToolDetailsForDisplay | null
  initialToolMetadata?: ToolMetadata
  initialGeneralComments?: string
  onSaveToolMetadata: (metadata: ToolMetadata) => Promise<void>
  onSaveGeneralComments: (text: string) => void
  isSavingMetadata: boolean
  formLoading?: boolean
  formError?: string | null
}

const defaultToolMetadata = (locationName: string): ToolMetadata => ({
  locationId: '',
  locationName
})

export function AuditForm ({
  audit,
  toolId,
  allTools,
  toolDetails,
  initialToolMetadata,
  initialGeneralComments = '',
  onSaveToolMetadata,
  onSaveGeneralComments,
  isSavingMetadata,
  formLoading = false,
  formError = null
}: AuditFormProps) {
  const questions = useFormStore((s) => s.questions)
  const { updateAnswer, updateComment, toggleFlag } = useFormStore.getState()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<QuestionFilter>(null)
  const [toolDropdownOpen, setToolDropdownOpen] = useState(false)
  const [toolSearch, setToolSearch] = useState('')
  const [toolMetadata, setToolMetadata] = useState<ToolMetadata>(() =>
    initialToolMetadata ?? defaultToolMetadata(toolDetails?.locationName ?? audit.location)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalComments, setGeneralComments] = useState(initialGeneralComments)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toolSearchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialToolMetadata != null) {
      setToolMetadata(initialToolMetadata)
    }
  }, [initialToolMetadata])

  useEffect(() => {
    setGeneralComments(initialGeneralComments)
  }, [initialGeneralComments])

  const debouncedSaveGeneralComments = useDebouncedCallback((value: string) => {
    onSaveGeneralComments(value)
  }, 600)

  useEffect(() => {
    return () => debouncedSaveGeneralComments.cancel()
  }, [debouncedSaveGeneralComments])

  const { currentToolIndex, currentTool, prevTool, nextTool, navigateToTool: navToTool } = useToolNavigation(
    allTools,
    toolId,
    audit.auditId
  )

  // Filters are scoped to the current tool/view.
  // When switching tools, clear the sidebar/mobile filter state.
  useEffect(() => {
    setActiveFilter(null)
  }, [toolId])

  const filteredQuestions = useFilteredQuestions(questions, searchQuery, activeFilter)
  const { total, completed, percent } = useAuditProgress(questions)
  const canSubmit = total > 0 && completed === total

  const blockedFromIndex = useMemo(() => {
    for (let i = 0; i < filteredQuestions.length; i++) {
      const q = filteredQuestions[i]
      if (q.answer === 'no' && q.note.trim().length === 0) {
        return i + 1
      }
    }
    return -1
  }, [filteredQuestions])

  const navigateToTool = useCallback(
    (id: string) => {
      setToolDropdownOpen(false)
      setToolSearch('')
      navToTool(id)
    },
    [navToTool]
  )

  useEffect(() => {
    function handleClickOutside (e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolDropdownOpen(false)
        setToolSearch('')
      }
    }
    if (toolDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      setTimeout(() => toolSearchInputRef.current?.focus(), 50)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [toolDropdownOpen])

  const filteredDropdownTools = toolSearch
    ? allTools.filter((t) => {
      const query = toolSearch.toLowerCase()
      return (
        t.name.toLowerCase().includes(query) ||
        (t.locationName?.toLowerCase().includes(query) ?? false) ||
        (t.assignedAuditor?.toLowerCase().includes(query) ?? false)
      )
    })
    : allTools

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await submitAnswers({ packageTemplateId: toolId })
      if (result instanceof Error) {
        toast.error(result.message)
        return
      }
      navigate(`/audit/${audit.auditId}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [audit.auditId, canSubmit, isSubmitting, navigate, toolId])

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-30 bg-card border-b border-border'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <AuditFormHeader
            audit={audit}
            currentToolName={toolDetails?.templateName ?? currentTool?.name ?? ''}
            percent={percent}
            toolLocationName={toolDetails?.locationName}
            assignedAuditor={toolDetails?.assignedAuditor}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <ToolNavigationBar
            prevTool={prevTool}
            nextTool={nextTool}
            onNavigate={navigateToTool}
            center={
              <ToolDropdown
                isOpen={toolDropdownOpen}
                onToggle={() => setToolDropdownOpen(!toolDropdownOpen)}
                toolSearch={toolSearch}
                onToolSearchChange={setToolSearch}
                tools={filteredDropdownTools}
                currentToolId={toolId}
                currentToolName={currentTool?.name ?? ''}
                currentToolIndex={currentToolIndex}
                allToolsLength={allTools.length}
                onSelectTool={navigateToTool}
                containerRef={dropdownRef}
                inputRef={toolSearchInputRef}
              />
            }
          />
        </div>
      </header>

      <div className='mx-auto max-w-7xl px-4 sm:px-6 py-6'>
        {formError != null && (
          <div className='mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
            {formError}
          </div>
        )}
        {formLoading && (
          <div className='mb-4 text-sm text-muted-foreground'>Loading tool and form...</div>
        )}
        <ToolMetadataPanel
          metadata={toolMetadata}
          initialMetadata={initialToolMetadata}
          onMetadataChange={setToolMetadata}
          onSave={() => {
            void onSaveToolMetadata(toolMetadata)
          }}
          isSaving={isSavingMetadata}
        />
        <div className='flex gap-6'>
          <aside className='hidden lg:block w-64 shrink-0'>
            <AuditProgressPanel
              questions={questions}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </aside>

          <div className='flex-1 min-w-0'>
            <div className='relative mb-5'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search questions...'
                className='pl-9 h-10 bg-card'
              />
            </div>

            <div className='mb-5'>
              <Label htmlFor='general-comments' className='text-sm font-medium text-card-foreground'>
                General comments
              </Label>
              <Textarea
                id='general-comments'
                value={generalComments}
                onChange={(e) => {
                  const value = e.target.value
                  setGeneralComments(value)
                  debouncedSaveGeneralComments(value)
                }}
                placeholder='Add general comments...'
                className='mt-1.5 min-h-[80px] resize-none bg-card text-sm'
              />
            </div>

            <div className='flex gap-2 mb-4 overflow-x-auto lg:hidden pb-1'>
              {[
                { key: null as QuestionFilter, label: `All (${total})` },
                { key: 'complete' as const, label: `Done (${completed})` },
                { key: 'incomplete' as const, label: `Todo (${total - completed})` },
                { key: 'flagged' as const, label: 'Flagged' }
              ].map(({ key, label }) => (
                <button
                  key={label}
                  type='button'
                  onClick={() => setActiveFilter(activeFilter === key ? null : key)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:text-card-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className='bg-card rounded-lg border border-border px-5 divide-y divide-border'>
              {filteredQuestions.map((q, i) => (
                <AuditQuestion
                  key={q.id}
                  number={i + 1}
                  text={q.text}
                  answer={q.answer}
                  note={q.note}
                  flagged={q.flagged}
                  disabled={blockedFromIndex !== -1 && i >= blockedFromIndex}
                  onAnswerChange={(value) => updateAnswer(q.id, value)}
                  onNoteChange={(value) => updateComment(q.id, value)}
                  onFlagToggle={() => toggleFlag(q.id)}
                />
              ))}

              {filteredQuestions.length === 0 && (
                <div className='py-12 text-center'>
                  <p className='text-sm text-muted-foreground'>
                    No questions match your search or filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useCallback, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AuditSection } from '@/components/audit-section'
import { AuditProgressPanel } from '@/components/audit-progress-panel'
import type { ToolInfo, SectionData, QuestionFilter, QuestionData, AuditFormContext } from '@/shared/types'
import { useToolNavigation } from '@/hooks/useToolNavigation'
import { useFilteredSections } from '@/hooks/useFilteredSections'
import { useAuditProgress } from '@/hooks/useAuditProgress'
import { AuditFormHeader } from './audit-form-header'
import { ToolNavigationBar } from './tool-navigation-bar'
import { ToolDropdown } from './tool-dropdown'

interface AuditFormProps {
  audit: AuditFormContext
  toolId: string
  allTools: ToolInfo[]
  sections: SectionData[]
}

export function AuditForm ({
  audit,
  toolId,
  allTools,
  sections: initialSections
}: AuditFormProps) {
  const [sections, setSections] = useState(initialSections)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<QuestionFilter>(null)
  const [toolDropdownOpen, setToolDropdownOpen] = useState(false)
  const [toolSearch, setToolSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toolSearchInputRef = useRef<HTMLInputElement>(null)

  const { currentToolIndex, currentTool, prevTool, nextTool, navigateToTool: navToTool } = useToolNavigation(
    allTools,
    toolId,
    audit.auditId
  )
  const { filteredSections, sectionsWithNumbers } = useFilteredSections(sections, searchQuery, activeFilter)
  const { total, completed, percent } = useAuditProgress(sections)

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

  const handleQuestionUpdate = useCallback(
    (questionId: string, updates: Partial<QuestionData>) => {
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          questions: section.questions.map((q) =>
            q.id === questionId ? { ...q, ...updates } : q
          )
        }))
      )
    },
    []
  )

  const filteredDropdownTools = toolSearch
    ? allTools.filter((t) => t.name.toLowerCase().includes(toolSearch.toLowerCase()))
    : allTools

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-30 bg-card border-b border-border'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6'>
          <AuditFormHeader
            audit={audit}
            currentToolName={currentTool?.name ?? ''}
            percent={percent}
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
        <div className='flex gap-6'>
          <aside className='hidden lg:block w-64 shrink-0'>
            <AuditProgressPanel
              sections={sections}
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

            <div className='space-y-2 bg-card rounded-lg border border-border px-5'>
              {sectionsWithNumbers.map((section) => (
                <div key={section.title} className='border-b border-border last:border-b-0'>
                  <AuditSection
                    title={section.title}
                    questions={section.questions}
                    startNumber={section.startNumber}
                    onQuestionUpdate={handleQuestionUpdate}
                  />
                </div>
              ))}

              {filteredSections.length === 0 && (
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

import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchableSelectOption {
  id: string
  name: string
}

interface SearchableSelectProps {
  id?: string
  options: SearchableSelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  searchPlaceholder: string
  emptyMessage: string
  disabled?: boolean
  className?: string
}

function SearchableSelect ({
  id,
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  className
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.id === value)
  const query = search.trim().toLowerCase()
  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(query))

  const close = useCallback(() => {
    setIsOpen(false)
    setSearch('')
  }, [])

  const selectOption = (optionId: string) => {
    onChange(optionId)
    close()
  }

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node) === true) return
      close()
    }

    // Radix closes the surrounding Dialog from a document keydown listener in the
    // capture phase, so Escape has to be intercepted earlier than that, on window.
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      close()
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape, true)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape, true)
    }
  }, [isOpen, close])

  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    const [firstOption] = filteredOptions
    if (firstOption == null) return
    selectOption(firstOption.id)
  }

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        id={id}
        disabled={disabled}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow]',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        <span className={cn('truncate', selectedOption == null && 'text-muted-foreground')}>
          {selectedOption?.name ?? placeholder}
        </span>
        <ChevronsUpDown className='size-4 shrink-0 opacity-50' />
      </button>

      {isOpen && (
        <div className='absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border border-border bg-card shadow-lg'>
          <div className='p-2 border-b border-border'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
              <input
                autoFocus
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className='w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'
              />
            </div>
          </div>

          {filteredOptions.length === 0 && (
            <p className='px-3 py-4 text-xs text-muted-foreground text-center'>{emptyMessage}</p>
          )}

          {filteredOptions.length > 0 && (
            <div role='listbox' className='max-h-64 overflow-y-auto py-1'>
              {filteredOptions.map((option) => {
                const isSelected = option.id === value
                return (
                  <button
                    key={option.id}
                    type='button'
                    role='option'
                    aria-selected={isSelected}
                    onClick={() => selectOption(option.id)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                      isSelected ? 'bg-primary/10 text-primary' : 'text-card-foreground hover:bg-secondary'
                    )}
                  >
                    <span className='flex-1 truncate'>{option.name}</span>
                    {isSelected && <Check className='size-3.5 shrink-0' />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { SearchableSelect }

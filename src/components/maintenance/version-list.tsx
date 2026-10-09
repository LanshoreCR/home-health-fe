import { Badge } from '@/components/ui/badge'
import type { TemplateVersion } from '@shared/types'
import { formatVersionDate } from './format'

export function VersionList ({ versions }: { versions: TemplateVersion[] }): JSX.Element | null {
  const published = versions.filter((v) => !v.isDraft)
  if (published.length === 0) return null

  return (
    <section className='mt-8'>
      <h2 className='mb-2 text-sm font-medium text-card-foreground'>Published versions</h2>
      <ul className='divide-y divide-border rounded-lg border border-border bg-card'>
        {published.map((version) => (
          <li key={version.templateVersionID} className='flex items-center gap-3 px-4 py-2.5 text-sm'>
            <span className='w-8 font-medium tabular-nums text-card-foreground'>v{version.versionNumber}</span>
            <span className='flex-1 text-xs text-muted-foreground'>
              {formatVersionDate(version.publishedOn)}
              {version.publishedByName != null && version.publishedByName !== 'migration' && ` · ${version.publishedByName}`}
            </span>
            <span className='text-xs tabular-nums text-muted-foreground'>{version.questionCount} questions</span>
            {version.isCurrent && <Badge variant='outline' className='border-emerald-200 bg-emerald-50 text-emerald-700'>Current</Badge>}
          </li>
        ))}
      </ul>
    </section>
  )
}

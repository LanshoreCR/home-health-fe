export const formatVersionDate = (value: string | null): string => {
  if (value == null) return ''
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const hasSection = (categ: string | null): categ is string =>
  categ != null && categ !== '' && categ !== 'N/A'

export const hasDefinition = (definition: string | null): definition is string =>
  definition != null && definition.trim() !== ''

# API Services Guide

This document describes how to create and use API fetching services in this project.

## Structure

- Config: `src/shared/services/api/config.ts`
- Axios instance: `src/shared/services/api/api-master.ts`
- Endpoint modules: `src/shared/services/api/endpoints/*.ts`

## Adding a new endpoint

1. Add the path to `ENDPOINTS` in `config.ts`:

```typescript
export const ENDPOINTS = {
  // ...
  GET_AUDITS_PACKAGES: '/api/Audits'
}
```

2. Create a typed service in `endpoints/`:

```typescript
import { axiosInstance } from '../api-master'
import { ENDPOINTS } from '../config'
import { toast } from 'sonner'
import type { AuditPackage } from '@shared/types'

export const getAuditPackages = async (): Promise<AuditPackage[]> => {
  try {
    const response = await axiosInstance.get<AuditPackage[]>(ENDPOINTS.GET_AUDITS_PACKAGES)
    if (response.status !== 200) {
      toast.error('Failed to fetch audit packages')
      throw new Error('error getting audits from the database')
    }
    return response.data
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch audit packages')
    throw new Error('cannot get audits')
  }
}
```

## Consuming services in components

Use an arrow function inside `useEffect` and handle errors via the service (toasts will already be shown):

```typescript
import { useEffect, useState } from 'react'
import { getAuditPackages } from '@shared/services/api/endpoints/audit-packages'
import type { AuditPackage } from '@shared/types'

export const ExampleComponent = () => {
  const [packages, setPackages] = useState<AuditPackage[]>([])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getAuditPackages()
        setPackages(data)
      } catch {
        // error already toasted in the service
      }
    }

    void fetchPackages()
  }, [])

  return null
}
```


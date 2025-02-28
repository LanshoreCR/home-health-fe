import { Card, Skeleton, Switch } from '@mui/material'

export default function QuestionCardSkeleton() {
  return (
    <Card className="flex w-full flex-col p-4 gap-y-4">
      <section className='flex w-full justify-between items-center gap-x-5'>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width={700} height={100} />
        <Switch disabled />
      </section>
      <section className='flex gap-x-3 w-full justify-center'>
        <Skeleton variant="rounded" width={150} height={35} />
        <Skeleton variant="rounded" width={150} height={35} />
      </section>
    </Card>
  )
}

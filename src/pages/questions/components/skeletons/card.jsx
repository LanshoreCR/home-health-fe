import { Card, Radio, Skeleton } from '@mui/material'

export default function SkeletonQuestionCard() {
  return (
    <Card className="flex flex-col w-full p-5">
      <Skeleton variant="text" width={500} height={50} />
      <div className='flex flex-col'>
        <div className='flex gap-x-2'>
          <Radio disabled />
          <Skeleton variant="text" width={70} />
        </div>
        <div className='flex gap-x-2'>
          <Radio disabled />
          <Skeleton variant="text" width={70} />
        </div>
        <div className='flex gap-x-2'>
          <Radio disabled />
          <Skeleton variant="text" width={70} />
        </div>
      </div>
    </Card>
  )
}

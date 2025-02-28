import { Paper, Skeleton } from '@mui/material'
import QuestionCardSkeleton from './question-card'

export default function MaintenancePageSkeleton() {
  return (
    <div className='w-full mx-auto'>
      <header className='mb-8 flex flex-col'>
        <div className='flex items-center gap-x-3'>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="text" width={200} height={50} />
        </div>
      </header>
      <div className='flex w-full justify-between gap-x-5'>
        <div className='flex min-w-72 max-w-80'>
          <Paper className='w-full p-3 mb-[157px]'>
            <header className='flex items-center justify-between mb-3'>
              <h3 className='font-semibold text-lg'>Tools</h3>
              <Skeleton variant="circular" width={30} height={30} />
            </header>
            <ul className='flex flex-col gap-y-2 w-full'>
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={150} />
            </ul>
          </Paper>
        </div>
        <div className='flex items-center w-full justify-between flex-col'>
          <section className='flex flex-col w-full gap-y-5'>
            {Array(3).fill().map((_, index) => (
              <QuestionCardSkeleton key={index} />
            ))}
          </section>
          <div className='flex items-center justify-between w-full mt-5'>
            <Skeleton variant="rounded" width={150} height={40} />
            <Skeleton variant="rounded" width={150} height={40} />
          </div>
        </div>
      </div>
    </div>
  )
}

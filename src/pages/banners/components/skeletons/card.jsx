import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

export default function SkeletonCard() {
  return (
    <Card className='p-4 hover:bg-blue-50'>
      <header className='flex w-full justify-between'>
        <div className='flex gap-x-3 items-center'>
          <Skeleton variant="text" width={500} height={50} md={{ width: 500 }} />
          <Skeleton variant="rounded" width={50} height={10} />
        </div>
        <Skeleton variant="circular" width={30} height={30} />
      </header>
      <footer className='w-full mt-3 flex justify-between items-center'>
        <article className='gap-x-3 flex'>
          <div className='flex items-center gap-x-2'>
            <Skeleton variant="circular" width={30} />
            <Skeleton variant="text" width={70} />
          </div>
          <div className='flex items-center gap-x-2'>
            <Skeleton variant="circular" width={30} />
            <Skeleton variant="text" width={70} />
          </div>
          <div className='flex items-center gap-x-2'>
            <Skeleton variant="circular" width={30} />
            <Skeleton variant="text" width={70} />
          </div>
          <div className='flex items-center gap-x-2'>
            <Skeleton variant="circular" width={30} />
            <Skeleton variant="text" width={70} />
          </div>
        </article>
        <Skeleton variant="rounded" width={150} height={40} />
      </footer>
    </Card>
  )
}

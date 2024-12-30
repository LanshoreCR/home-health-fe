import Skeleton from '@mui/material/Skeleton'
import SkeletonTable from './components/skeletons/table'

export default function LoadingToolsPage() {
  return (
    <>
      <Skeleton variant="text" width={400} />
      <div className='flex items-center w-full justify-between mb-10'>
        <div className='flex gap-x-2 items-center'>
          <Skeleton variant='rounded' width={200} height={30} />
          <Skeleton variant='circular' width={30} />
        </div>
        <Skeleton variant="rounded" width={150} height={50} />
      </div>
      <section className='mb-16'>
        <SkeletonTable />
      </section>
    </>
  )
}

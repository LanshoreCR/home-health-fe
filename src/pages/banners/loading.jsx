import Skeleton from '@mui/material/Skeleton'
import SkeletonCard from './components/skeletons/card'

export default function LoadingBannersPage() {
  return (
    <div>
      <span className='sr-only' role='contentinfo'>Loading</span>
      <header className='flex justify-between items-center'>
        <Skeleton variant="rounded" width={150} height={50} />
        <Skeleton variant="rounded" width={150} height={50} />
      </header>
      <ul className='flex flex-col gap-y-5 mb-16 mt-5'>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </ul>
    </div>
  )
}

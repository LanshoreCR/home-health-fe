import { Skeleton } from '@mui/material'

export default function CreateToolSkeleton() {
  return (
    <div className='w-full max-w-4xl mx-auto'>
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Skeleton variant="text" width={500} height={50} md={{ width: 500 }} />
        <div className='w-full flex justify-end mb-10'>
          <Skeleton variant="rounded" width={150} height={40} />
        </div>
        <ul className='flex flex-col gap-y-5 mb-16 mt-5'>
          {
            Array(3).fill(null).map((_, index) => (
              <section className="flex w-full gap-x-5 justify-center" key={index}>
                <Skeleton variant="rounded" width={350} height={60} />
                <Skeleton variant="rounded" width={230} height={60} />
                <Skeleton variant="rounded" width={300} height={60} />
                <Skeleton variant="circular" width={30} height={30} />
              </section>
            ))
          }
        </ul>
        <footer className='w-full flex justify-between mt-8 mb-16'>
          <Skeleton variant="text" width={150} height={40} />
          <Skeleton variant="rounded" width={150} height={40} />
        </footer>
      </div>
    </div>
  )
}

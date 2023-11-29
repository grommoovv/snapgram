import { useGetUsers } from '@/api'
import { UserCard } from '@/components/shared'
import { Loader } from 'lucide-react'
import { FC } from 'react'

const RightSidebar: FC = () => {
  const { data: creators, isLoading: isUserLoading, isError: isErrorCreators } = useGetUsers(10)

  if (isErrorCreators) {
    return (
      <div className='rightsidebar'>
        <p className='body-medium text-light-1'>Something bad happened</p>
      </div>
    )
  }

  return (
    <>
      <div className='rightsidebar'>
        <h3 className='h3-bold text-light-1'>Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className='grid 2xl:grid-cols-1 gap-6'>
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export { RightSidebar }

import { Loader, PostCard } from '@/components/shared'
import { useGetRecentPosts } from '@/api'
import { Models } from 'appwrite'
import { FC } from 'react'
// import cls from './Home.module.scss'

const Home: FC = () => {
  const { data: posts, isLoading: isPostLoading, isError: isErrorPosts } = useGetRecentPosts()

  if (isErrorPosts) {
    return (
      <div className='flex flex-1'>
        <div className='home-container'>
          <p className='body-medium text-light-1'>Something bad happened</p>
        </div>
        <div className='home-creators'>
          <p className='body-medium text-light-1'>Something bad happened</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold w-full'>Home</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full '>
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className='flex justify-center w-full'>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home

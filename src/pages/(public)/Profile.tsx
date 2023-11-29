import { Route, Routes, Link, Outlet, useParams, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui'
import LikedPosts from '@/pages/(public)/LikedPosts'
import { useUserContext } from '@/lib/context/auth'
import { useGetUserById } from '@/api'
import { GridPostList, Loader } from '@/components/shared'

interface StabBlockProps {
  value: string | number
  label: string
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className='flex-center gap-2'>
    <p className='body-bold text-primary-500'>{value}</p>
    <p className='base-medium text-light-2'>{label}</p>
  </div>
)

const Profile = () => {
  const { id } = useParams()
  const { user } = useUserContext()
  const { pathname } = useLocation()

  const { data: currentUser } = useGetUserById(id || '')

  if (!currentUser)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )

  return (
    <>
      <div className='profile-container w-full'>
        <div className='relative'>
          <div className='bg-[#FE9667] w-full h-[360px] '></div>
          <div className='profile-inner_container px-8 absolute bottom-[70px]'>
            <div className='flex flex-col gap-2 flex-1'>
              <div className='flex justify-between'>
                <img
                  className='w-28 h-28 lg:h-[140px] lg:w-[140px] rounded-full bg-black border-[#000] border-[4px]'
                  src={currentUser.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt='profile'
                />
                <div className='flex justify-center items-end gap-4'>
                  <div className={`${user.id !== currentUser.$id && 'hidden'}`}>
                    <Link
                      to={`/update-profile/${currentUser.$id}`}
                      className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                        user.id !== currentUser.$id && 'hidden'
                      }`}
                    >
                      <img src={'/assets/icons/edit.svg'} alt='edit' width={20} height={20} />
                      <p className='flex whitespace-nowrap small-medium'>Edit Profile</p>
                    </Link>
                  </div>
                  <div className={`${user.id === id && 'hidden'}`}>
                    <Button type='button' className='shad-button_primary px-8'>
                      Follow
                    </Button>
                  </div>
                </div>
              </div>

              <div className='flex flex-col flex-1 gap-8 justify-between'>
                <div className='flex flex-col gap-2 w-full'>
                  <h1 className='h3-bold w-full'>{currentUser.name}</h1>
                  <p className='body-medium text-light-3'>@{currentUser.username}</p>
                </div>

                <div className='flex flex-wrap items-center gap-8 z-20'>
                  <StatBlock value={currentUser.posts.length} label='Posts' />
                  <StatBlock value={20} label='Followers' />
                  <StatBlock value={20} label='Following' />
                </div>

                <p className='base-medium'>{currentUser.bio}</p>
              </div>
            </div>
          </div>
          {currentUser.$id === user.id && (
            <div className='flex max-w-5xl w-full'>
              <Link
                to={`/profile/${id}`}
                className={`profile-tab rounded-l-lg ${
                  pathname === `/profile/${id}` && '!bg-dark-3'
                }`}
              >
                <img src={'/assets/icons/posts.svg'} alt='posts' width={20} height={20} />
                Posts
              </Link>
              <Link
                to={`/profile/${id}/liked-posts`}
                className={`profile-tab rounded-r-lg ${
                  pathname === `/profile/${id}/liked-posts` && '!bg-dark-3'
                }`}
              >
                <img src={'/assets/icons/like.svg'} alt='like' width={20} height={20} />
                Liked Posts
              </Link>
            </div>
          )}
        </div>

        <Routes>
          <Route index element={<GridPostList posts={currentUser.posts} showUser={false} />} />
          {currentUser.$id === user.id && <Route path='/liked-posts' element={<LikedPosts />} />}
        </Routes>
        <Outlet />
      </div>
    </>
  )
}

export default Profile

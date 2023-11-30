import { Models } from 'appwrite'
import { Link } from 'react-router-dom'

import { Button } from '../ui/button'

type UserCardProps = {
  user: Models.Document
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user.$id}`} className='user-card'>
      <img
        src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
        alt='creator'
        className='rounded-full w-10 h-10'
      />

      <div className='flex flex-col gap-1'>
        <p className='base-medium text-light-1  line-clamp-1'>{user.name}</p>
        <p className='small-regular text-light-3  line-clamp-1'>@{user.username}</p>
      </div>

      <Button type='button' size='sm' className='shad-button_primary px-5 ml-[auto]'>
        Follow
      </Button>
    </Link>
  )
}

export { UserCard }

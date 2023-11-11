import { FC } from 'react'
import { Bottombar, LeftSidebar, Topbar } from '.'
import { Outlet } from 'react-router-dom'

const PublicLayout: FC = () => {
  return (
    <>
      <div className='w-full md:flex'>
        <Topbar />
        <LeftSidebar />

        <section className='flex flex-1 h-full'>
          <Outlet />
        </section>

        <Bottombar />
      </div>
    </>
  )
}

export { PublicLayout }

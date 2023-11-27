import { FC } from 'react'
import { Bottombar, LeftSidebar, RightSidebar, Topbar } from '.'
import { Outlet } from 'react-router-dom'

const PublicLayout: FC = () => {
  return (
    <>
      <div className='w-full md:flex'>
        <Topbar />
        <LeftSidebar />
        <section className='page-container'>
          <Outlet />
        </section>
        <RightSidebar />
        <Bottombar />
      </div>
    </>
  )
}

export { PublicLayout }

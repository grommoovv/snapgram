import './globals.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp } from './pages/(private)'
import { Home } from './pages/(public)'
import { PrivateLayout, PublicLayout } from './layout'

const App = () => {
  return (
    <main className='flex h-screen'>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route element={<PrivateLayout />}>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
          </Route>

          {/* private routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export { App }

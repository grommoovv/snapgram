import { Routes, Route } from 'react-router-dom'
import { PrivateLayout, PublicLayout } from './components/layout'
import { SignIn, SignUp } from './pages/(private)'
import {
  Home,
  Explore,
  Saved,
  People,
  CreatePost,
  EditPost,
  PostDetails,
  Profile,
  UpdateProfile,
} from './pages/(public)'

const Router = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route element={<PrivateLayout />}>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Route>

      {/* private routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/saved' element={<Saved />} />
        <Route path='/people' element={<People />} />
        <Route path='/create-post' element={<CreatePost />} />
        <Route path='/update-post/:id' element={<EditPost />} />
        <Route path='/posts/:id' element={<PostDetails />} />
        <Route path='/profile/:id/*' element={<Profile />} />
        <Route path='/update-profile/:id' element={<UpdateProfile />} />
      </Route>
    </Routes>
  )
}

export { Router }

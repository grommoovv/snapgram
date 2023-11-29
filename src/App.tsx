import { Router } from './router'
import { Toaster } from './components/ui'
import './styles/globals.css'

const App = () => {
  return (
    <main className='flex h-screen'>
      <Router />
      <Toaster />
    </main>
  )
}

export { App }

import Landing from './Components/Landing'
import Navbar from './Components/Navbar'
import '@babel/polyfill';

export default function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <Landing />
    </div>
  )
}
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Chatpage from './pages/ChatPage'
import Homepage from './pages/HomePage'

function App() {

  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Homepage/>} exact />
      <Route path="/chats" component={<Chatpage/>} />
      </Routes>
    </div>
  )
}

export default App

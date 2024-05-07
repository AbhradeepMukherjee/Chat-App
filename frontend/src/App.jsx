import { Route, Routes } from 'react-router-dom'
import './App.css'
import Chatpage from './pages/ChatPage.jsx'
import Homepage from './pages/HomePage.jsx'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/chats" element={<Chatpage/>}/>
      </Routes>
    </div>
  )
}

export default App

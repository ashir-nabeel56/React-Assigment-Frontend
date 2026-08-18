import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from "react-router-dom"
import Routing from "./route/routing"
import TopBar from "./components/top/topbar"
import Navbar from "./components/navbar/navbar"
import Footer from "./components/last/footer"

function App() {
  return (
    
    <BrowserRouter>
    <TopBar/>
    <Navbar/>
      <Routing/>
          <Footer/>
<ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  )
}

export default App

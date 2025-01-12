
// import './App.css'

import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import A350 from "./pages/A350"
import NoMatch from "./pages/NoMatch"

function App() {
 
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/A350" element={<A350 />} />
      <Route path="/*" element={<NoMatch />} />
    </Routes>

   </Router>
  )
}

export default App

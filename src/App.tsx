
// import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import NoMatch from "./pages/NoMatch"
import AppLayout from "./components/layout/AppLayout"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { theme } from "./theme/theme"
import CheckListLayout from "./components/layout/CheckListLayout"
import { useEffect, useState } from "react"
import { ListItem } from "./types/index"
import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import E170 from "./pages/E170"
import ATR from "./pages/ATR"


function App() {
  
  const[listItems, setListItems] = useState<ListItem[]>([]);

  useEffect(() => {
    const fecheListItems = async() => {
      try {
        const querySnapshot = await getDocs(collection(db, "checklistItem"))
        console.log(querySnapshot)
        const listItemsData = querySnapshot.docs.map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          return {
            ...doc.data(),
            id: doc.id,
          } as ListItem
        })
        console.log(listItemsData)
        setListItems(listItemsData)  
      } catch(err) {
        // error
      }
    }
    fecheListItems();
  },[])

 
  return (
   <ThemeProvider theme={theme}>
   <CssBaseline />
   <Router>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/CheckListLayout" element={<CheckListLayout />} />
          {/* <Route path="E170" element={<E170 />} />
          <Route path="ATR" element={<ATR/>} /> */}
        <Route path="/*" element={<NoMatch />} />
      </Route>
    </Routes>
   </Router>
   </ThemeProvider> 
  )
}

export default App

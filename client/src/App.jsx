import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import AI from './Pages/AI'

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/model" element={<AI />} />
  </Routes>
)

export default App



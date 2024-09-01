import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './website/pages/home/home'
import Find from './website/pages/find/find'
import RouteDetail from './website/pages/route detail/route_detail'

function App() {

  return (
    <div className="main_div">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<Find />} />
          <Route path="/details" element={<RouteDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App

import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Orders from "./pages/Orders.jsx";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        <Navbar />
        <hr />
        <div className="flex w-full">
          <Sidebar />
          <div className="mx-auto my-8 ml-[max(5vw,25px)] w-[70%] text-gray-600 text-base">
            <Routes>
              <Route element={<Add />} path="/add" />
              <Route element={<List />} path="/list" />
              <Route element={<Orders />} path="/orders" />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

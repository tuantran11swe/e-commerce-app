import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";

function App() {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Collection />} path="/collection" />
        <Route element={<About />} path="/about" />
        <Route element={<Contact />} path="/contact" />
        <Route element={<Product />} path="/product/:productId" />
        <Route element={<Cart />} path="/cart" />
        <Route element={<Login />} path="/login" />
        <Route element={<PlaceOrder />} path="/place-order" />
        <Route element={<Orders />} path="/orders" />
      </Routes>
    </div>
  );
}

export default App;

import { Routes, Route } from "react-router";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Home from "./Pages/Home";
import Favourite from "./Pages/Favourite";
import Login from "./Pages/Login";
import MyRecipe from "./Pages/MyRecipe";
import Context from "./Context/Context";
import { ToastContainer } from "react-toastify";
import AddRecipe from "./Pages/AddRecipe";
import RecipeEdite from "./Pages/RecipeEdite";
import DetailRecipe from "./Pages/DetailRecipe";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Context>
      <Header />
      <div className="min-h-screen bg-black">
        <ToastContainer theme="dark" position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/myrecipe" element={<MyRecipe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addRecipe" element={<AddRecipe />} />
          <Route path="/editRecipe/:id" element={<RecipeEdite />} />
          <Route path="/detailRecipe/:id" element={<DetailRecipe />} />
        </Routes>
      </div>
      <Footer />
    </Context>
  );
}

export default App;
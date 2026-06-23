import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaFilter } from "react-icons/fa";
import { RecipeContext } from "../Context/Context";
import { toast } from "react-toastify";

const Header = () => {
  const [open, setopen] = useState<boolean>(false);
  const context = useContext(RecipeContext);
  if (!context) return null;
  const { login, setlogin } = context;
  const navigate = useNavigate();

  const navbar = login
    ? [
        { name: "Home", path: "/" },
        { name: "My Recipe", path: "/myrecipe" },
        { name: "Favourite", path: "/favourite" },
        { name: "LogOut", path: "/login" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Login", path: "/login" },
      ];

  const handleLogout = () => {
    setlogin(false);
    toast.success("Logged out successfully");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <section id="header" className="border-b border-gray-400 sticky top-0 z-50 bg-black">
      <div className="px-6 max-w-7xl m-auto">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="text-4xl text-white font-bold">Recipes</Link>
          <div className="sm:hidden">
            <button className="text-white text-2xl" onClick={() => setopen(!open)}>
              <FaFilter />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 bg-white rounded shadow w-40 overflow-hidden text-black">
                {navbar.map((e) => (
                  <Link
                    onClick={() => {
                      setopen(false);
                      if (e.name === "LogOut") {
                        handleLogout();
                      }
                    }}
                    to={e.path}
                    key={e.name + e.path}
                    className="p-3 block hover:bg-gray-100 cursor-pointer"
                  >
                    {e.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <ul className="hidden sm:flex text-white space-x-6">
            {navbar.map((x) => (
              <Link
                to={x.path}
                key={x.path}
                onClick={() => {
                  setopen(false);
                  if (x.name === "LogOut") {
                    handleLogout();
                  }
                }}
                className="hover:text-amber-100 transition duration-300"
              >
                {x.name}
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Header;
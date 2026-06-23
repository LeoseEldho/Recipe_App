import { useContext, useState } from "react";
import { RecipeContext } from "../Context/Context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Login = () => {
  const context = useContext(RecipeContext);
  if (!context) return null;
  const { api, isRegister, setisRegister, setlogin } = context;

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onsubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isRegister === "Register") {
        const response = await api.post("/api/register", {
          name,
          password,
          email,
        });
        if (response.data.success) {
          toast.success(response.data.message);
          setisRegister("login");
          // Clear inputs on successful sign up
          setName("");
          setPassword("");
        }
      } else {
        const response = await api.post("/api/login", { email, password });
        if (response.data.success) {
          toast.success(response.data.message);
          
          // Secure values into localStorage
          localStorage.setItem("token", response.data.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.data.user));
          
          setlogin(true);
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-md m-auto px-6 py-16 text-white h-full flex justify-center items-center">
      <form
        onSubmit={onsubmit}
        className="border border-gray-400 rounded-3xl p-8 space-y-4 w-full bg-zinc-900"
      >
        <h3 className="text-center text-3xl font-bold mb-4">
          {isRegister === "login" ? "User Login" : "User Register"}
        </h3>

        {isRegister === "Register" && (
          <div className="flex flex-col">
            <label className="text-sm mb-1">Name:</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="p-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-200"
            />
          </div>
        )}

        <div className="flex flex-col">
          <label className="text-sm mb-1">Email:</label>
          <input
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className="p-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-200"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="p-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-200"
          />
        </div>

        {isRegister === "login" ? (
          <p
            className="text-sm text-center underline cursor-pointer hover:text-amber-100 transition duration-150"
            onClick={() => setisRegister("Register")}
          >
            Don't have an account? Sign Up
          </p>
        ) : (
          <p
            className="text-sm text-center underline cursor-pointer hover:text-amber-100 transition duration-150"
            onClick={() => setisRegister("login")}
          >
            Already have an account? Login
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-100 text-center flex justify-center w-full mt-5 text-black font-extrabold p-3 rounded-full hover:bg-amber-200 transition disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : isRegister === "login" ? "Login" : "Register"}
        </button>
      </form>
    </section>
  );
};

export default Login;
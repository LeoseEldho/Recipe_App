import { useContext, useEffect, useState } from "react";
import { FaHeart, FaSearch } from "react-icons/fa";
import { RecipeContext } from "../Context/Context";
import { BsStopwatch } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Home = () => {
  const context = useContext(RecipeContext);
  if (!context) return null;
  const { api } = context;
  let [recipe, setRecipe] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const respone = await api.get("/api/data");

        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        const updated = respone.data.data.map((item: any) => ({
          ...item,
          isFavorite: user ? item.favirate?.includes(user._id) : false,
        }));

        setRecipe(updated);
        setLoading(false);
      } catch (error:any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    };
    fetchData();
  }, [api]);

  const favirate = async (id: string) => {
    try {
       await api.put(`/api/favorite/${id}`);

      setRecipe((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isFavorite: !item.isFavorite } : item,
        ),
      );
    } catch (error: any) {
      console.log(error);
    }
  };
  const filteredRecipes = recipe.filter((item: any) =>
  item.title.toLowerCase().includes(search.toLowerCase())
);
  return (
    <section className="text-white max-w-7xl m-auto px-6 ">
      <div className="flex  justify-center pt-6 mb-6">
        <div className="w-full ">
          <form
            onSubmit={(e) => e.preventDefault()}
            action=""
            className="flex items-center border border-gray-400 rounded-2xl outline-0 "
          >
            <FaSearch className="ml-5 w-5" />
            <input
              type="text"
              placeholder="Seach for Recipe"
              className="pl-3 py-4 outline-0 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-purple-600 rounded-3xl px-3 text-sm font-bold py-1.5 mr-3">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="grid  items-center mb-6 border sm:grid-cols-1 p-4 rounded-3xl">
        <h3 className="px-2">Add Your Recipe Ideas :</h3>
        {/* <div className="hidden">
          <img src="src\assets\food\image.png" alt="" />
        </div> */}
        <div className="flex justify-between my-2.5 border border-gray-400 rounded-2xl px-2.5 py-3 w-full">
          <h2 className="font-extrabold">Add New Recipe</h2>
          <button
            onClick={() => navigate("/addRecipe")}
            className="bg-green-600 rounded-4xl px-2 font-bold"
          >
            Add
          </button>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center text-2xl">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 text-white gap-6 sm:grid-cols-2 items-center justify-center md:grid-cols-3 pb-6">
            {filteredRecipes.map((x: any) => (
              <div
                key={x._id}
                className="flex flex-col rounded-3xl relative border border-gray-400 overflow-hidden "
              >
                <div className="h-56 relative">
                  <img
                    className="w-full h-full object-cover"
                   src={`${import.meta.env.VITEBACKENDURL}/image/${x.image}`}
                    alt={x.name}
                  />
                  <div className="absolute top-3 left-2 p-2 rounded-full border-gray-400 border inline-block items-center bg-black">
                    <FaHeart
                      onClick={() => favirate(x._id)}
                      className={x.isFavorite ? "text-red-500" : "text-white"}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between p-6 space-y-2">
                  <h3 className="text-2xl font-bold">{x.title}</h3>
                  <p className="  flex gap-1.5  items-center text-sm">
                    <BsStopwatch /> {x.time}
                  </p>
                  <Link to={`/detailRecipe/${x._id}`} className="">
                    <button className="mt-3 rounded-full border w-full border-gray-400 py-3  bg-yellow-100 text-black font-extrabold">
                      View Recipe
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;

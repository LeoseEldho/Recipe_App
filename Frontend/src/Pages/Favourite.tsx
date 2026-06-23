import { useContext, useEffect, useState } from "react";
import { RecipeContext } from "../Context/Context";
import { BsStopwatch } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";

const Favourite = () => {
  const context = useContext(RecipeContext);
  const [favRecipes, setFavRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!context) return;
    const { api } = context;

    const getFav = async () => {
      try {
        const res = await api.get("/api/data");
        const userString = localStorage.getItem("user");
        if (!userString) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userString);
        const filtered = res.data.data.filter((item: any) =>
          item.favirate?.includes(user.id)
        ).map((item: any) => ({ ...item, isFavorite: true })); // Add default true value

        setFavRecipes(filtered);
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };
    getFav();
  }, [context]);

  const favorite = async (id: string) => {
    if (!context) return;
    const { api } = context;

    // Remove instantly from list for better UX
    const originalList = [...favRecipes];
    setFavRecipes((prev) => prev.filter((item) => item._id !== id && item.id !== id));

    try {
      await api.put(`/api/favorite/${id}`);
      toast.success("Favorites updated");
    } catch (error: any) {
      console.error(error);
      setFavRecipes(originalList); // Rollback state
      toast.error("Error updating favorite selection");
    }
  };

  if (!context) return null;

  return (
    <section className="text-white p-6 max-w-7xl m-auto min-h-screen">
      <h2 className="text-2xl mb-6 text-center">My Favourite Recipes ❤️</h2>

      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : favRecipes.length === 0 ? (
        <div className="text-center text-xl text-gray-400">No favourite recipes found</div>
      ) : (
        <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {favRecipes.map((x: any) => (
            <div
              key={x._id || x.id}
              className="flex flex-col rounded-3xl relative border border-gray-400 overflow-hidden"
            >
              <div className="h-56 relative bg-zinc-900">
                <img
                  className="w-full h-full object-cover"
                  src={`${import.meta.env.VITEBACKENDURL}/image/${x.image}`}
                  loading="lazy"
                  alt={x.title}
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available";
                  }}
                />
                <button 
                  onClick={() => favorite(x._id || x.id)}
                  className="absolute top-3 left-2 p-2 rounded-full border border-gray-400 inline-block items-center bg-black hover:scale-110 transition duration-200"
                >
                  <FaHeart className="text-red-500" />
                </button>
              </div>
              <div className="flex flex-col justify-between p-6 space-y-2">
                <h3 className="text-2xl font-bold truncate">{x.title}</h3>
                <p className="flex gap-1.5 items-center text-sm">
                  <BsStopwatch /> {x.time}
                </p>
                <Link to={`/detailRecipe/${x._id || x.id}`}>
                  <button className="mt-3 rounded-full border w-full border-gray-400 py-3 bg-yellow-100 text-black font-extrabold hover:bg-yellow-200 transition">
                    View Recipe
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Favourite;
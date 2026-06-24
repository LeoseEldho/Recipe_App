import { useContext, useEffect, useState } from "react";
import { BsStopwatch } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { RecipeContext } from "../Context/Context";
import { Link } from "react-router";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { BackUrl } from "../Context/Context";

const MyRecipe = () => {
  const context = useContext(RecipeContext);

  const [loading, setLoading] = useState(true);
  const [userRecipe, setUserRecipe] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!context) return;
    const { api } = context;

    const getData = async () => {
      try {
        const res = await api.get("/api/data");
        if (res.data) {
          const allRecipes = res.data.data;
          const userString = localStorage.getItem("user");

          if (!userString) {
            setLoading(false);
            return;
          }

          const user = JSON.parse(userString);
          const filtered = allRecipes.filter(
            (item: any) => item.createdBy?.toString() === user.id
          );
          setUserRecipe(filtered);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Error reading your recipes");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [context]);

  const DeleteRecipe = async (id: string) => {
    if (!context) return;
    const { api } = context;

    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      let res = await api.delete(`/api/${id}`);
      if (res.data) {
        toast.success(res.data.message);
        // Remove item from state without needing page refresh
        setUserRecipe((prev) => prev.filter((recipe) => recipe._id !== id));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete item");
    }
  };

  if (!context) return null;

  return (
    <section className="text-white max-w-7xl m-auto px-6 min-h-screen">
      {loading ? (
        <div className="flex text-2xl justify-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 p-6">
          {userRecipe.length === 0 ? (
            <div className="text-center w-full text-2xl py-8 col-span-full">
              No recipes found. Upload one to get started!
            </div>
          ) : (
            userRecipe.map((x: any) => (
              <div
                key={x._id || x.id}
                className="flex flex-col rounded-3xl relative border border-gray-400 overflow-hidden"
              >
                <div className="h-56 relative bg-zinc-900">
                  <img
                    className="w-full h-full object-cover"
                    src={`${BackUrl}/image/${x.image}`}
                    loading="lazy"
                    alt={x.title}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available";
                    }}
                  />
                  <div className="absolute top-3 right-12 p-2 rounded-full border border-gray-400 inline-block bg-black hover:scale-110 transition">
                    <Link to={`/editRecipe/${x._id || x.id}`}>
                      <FaEdit className="text-white" />
                    </Link>
                  </div>
                  <button
                    onClick={() => DeleteRecipe(x._id || x.id)}
                    className="absolute top-3 right-2 p-2 rounded-full border border-gray-400 inline-block bg-black hover:scale-110 transition"
                  >
                    <MdDeleteForever className="text-red-500" />
                  </button>
                </div>
                <div className="flex flex-col justify-between p-6 space-y-2">
                  <h3 className="text-2xl font-bold truncate">{x.title}</h3>
                  <p className="flex gap-1.5 items-center text-sm">
                    <BsStopwatch /> {x.time}
                  </p>
                  <Link to={`/detailRecipe/${x._id || x.id}`}>
                    <button className="mt-3 rounded-full border border-gray-400 py-3 w-full bg-yellow-100 text-black font-extrabold hover:bg-yellow-200 transition">
                      View Recipe
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default MyRecipe;
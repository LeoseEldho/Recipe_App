import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { RecipeContext } from "../Context/Context";
import { toast } from "react-toastify";

const DetailRecipe = () => {
  const { id } = useParams();
  const context = useContext(RecipeContext);
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!context) return;
    const { api } = context;

    const fetchData = async () => {
      try {
        const res = await api.get(`/api/${id}`);
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const data = res.data.data;

        const updatedRecipe = {
          ...data,
          isFavorite: user ? data.favirate?.includes(user.id) : false,
        };

        setRecipe(updatedRecipe);
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load recipe details");
      }
    };

    fetchData();
  }, [id, context]);

  const favorite = async (recipeId: string) => {
    if (!context) return;
    const { api } = context;

    // Optimistic UI state update
    setRecipe((prev: any) => ({
      ...prev,
      isFavorite: !prev.isFavorite,
    }));

    try {
      await api.put(`/api/favorite/${recipeId}`);
    } catch (error: any) {
      console.error(error);
      // Revert change if the server connection drops
      setRecipe((prev: any) => ({
        ...prev,
        isFavorite: !prev.isFavorite,
      }));
      toast.error("Failed to update favorite status");
    }
  };

  if (!recipe) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-white">
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div className="rounded-3xl overflow-hidden border border-gray-400">
          <img
            src={`${import.meta.env.VITEBACKENDURL}/image/${recipe.image}`}
            className="w-full h-96 object-cover"
            loading="lazy"
            alt={recipe.title}
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400?text=No+Image+Available";
            }}
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{recipe.title}</h1>
          <p className="mb-4 text-sm text-gray-300">⏱ {recipe.time}</p>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => favorite(recipe._id || recipe.id)}
              className="flex-1 px-6 py-3 rounded-xl font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-blue-500 hover:text-white hover:border-transparent transition-all duration-300"
            >
              {recipe.isFavorite ? "Remove Favorite" : "Add Favorite"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.split(",").map((item: string, index: number) => (
              <li key={index}>• {item.trim()}</li>
            ))}
          </ul>
        </div>

        <div className="border border-gray-400 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Instructions</h2>
          <ul className="space-y-2">
            {recipe.instructions.split(".").map((step: string, index: number) =>
              step.trim() ? (
                <li key={index}>
                  {index + 1}. {step.trim()}
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailRecipe;
import { useContext, useState, useEffect } from "react";
import { RecipeContext } from "../Context/Context";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AddRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) return null;
  const { api } = context;
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    time: "",
    ingredients: "",
    instructions: "",
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const files = e.target.files;
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : null,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    }
  };

  const recipeHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("time", form.time);
      formData.append("ingredients", form.ingredients);
      formData.append("instructions", form.instructions);

      if (form.file) {
        formData.append("file", form.file);
      }

      const res = await api.post("/api/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data) {
        toast.success(res.data.message || "Recipe Uploaded!");
        navigate("/");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong uploading recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <section className="flex justify-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 text-white p-6 rounded-2xl">
        <h2 className="text-2xl mb-6 text-center">Add New Recipe</h2>

        <form className="space-y-5" onSubmit={recipeHandler}>
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Title</label>
            <input
              required
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="p-2 bg-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Time (e.g. 30 mins)</label>
            <input
              required
              type="text"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="p-2 bg-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-200"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Ingredients (comma-separated)</label>
            <textarea
              required
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              className="p-2 bg-gray-800 rounded-md h-24 focus:outline-none focus:ring-1 focus:ring-amber-200"
              placeholder="e.g. 2 eggs, 1 cup flour, sugar"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Instructions (period-separated steps)</label>
            <textarea
              required
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              className="p-2 bg-gray-800 rounded-md h-24 focus:outline-none focus:ring-1 focus:ring-amber-200"
              placeholder="e.g. Mix ingredients together. Bake at 350 degrees."
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Recipe Image</label>
            <input
              accept="image/*"
              type="file"
              name="file"
              onChange={handleChange}
              className="p-2 bg-gray-800 rounded-md file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:bg-zinc-700 file:text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex justify-center border border-gray-400 w-full p-2 rounded-2xl hover:bg-white hover:text-black font-extrabold transition-all ease-in duration-300 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddRecipe;
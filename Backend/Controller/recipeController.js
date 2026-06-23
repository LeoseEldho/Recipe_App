import Recipe from "../Model/recipeModel.js";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image');
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const filename = Date.now() + '-' + file.fieldname + fileExtension;
    cb(null, filename);
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpg, jpeg, png, gif, webp) are allowed!'));
    }
  }
});

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).sort({ createdAt: -1 });
    if (!recipes || recipes.length === 0) {
      return res.status(200).json({ success: true, message: "Add Recipes To See", data: [] });
    }
    res.status(200).json({ success: true, message: "All Recipes", data: recipes });
  } catch (error) {
    console.error("Get Recipes Error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve recipes" });
  }
};

export const getRecipesById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "There is no recipe with this Id" });
    }
    res.status(200).json({ success: true, message: "Recipe detail retrieved", data: recipe });
  } catch (error) {
    console.error("Get Recipe by ID Error:", error);
    res.status(500).json({ success: false, message: "Failed to find recipe" });
  }
};

export const addRecipes = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !ingredients || !instructions || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials: title, ingredients, instructions, and time are required",
      });
    }

    const isRecipe = await Recipe.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
    if (isRecipe) {
      return res.status(400).json({
        success: false,
        message: "A recipe with this title already exists",
      });
    }

    const newRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      time,
      image,
      createdBy: req.userId.id
    });

    res.status(201).json({
      success: true,
      message: "Recipe Added Successfully",
      data: newRecipe
    });
  } catch (error) {
    console.error("Add Recipe Error:", error);
    res.status(500).json({ success: false, message: "Server error occurred while adding recipe" });
  }
};

export const editRecipes = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "This Recipe is not Present",
      });
    }

    // Auth validation check
    if (recipe.createdBy.toString() !== req.userId.id) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Recipe Updated Successfully",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("Edit Recipe Error:", error);
    res.status(500).json({ success: false, message: "Server error updating recipe" });
  }
};

export const deleteRecipes = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "There is no recipe with this Id",
      });
    }

    if (recipe.createdBy.toString() !== req.userId.id) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Recipe has been Deleted",
    });
  } catch (error) {
    console.error("Delete Recipe Error:", error);
    res.status(500).json({ success: false, message: "Server error deleting recipe" });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.userId.id;
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    const isFav = recipe.favirate.includes(userId);
    const updateQuery = isFav 
      ? { $pull: { favirate: userId } } 
      : { $addToSet: { favirate: userId } };

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId, 
      updateQuery, 
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: isFav ? "Removed from favorites" : "Added to favorites",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    res.status(500).json({ success: false, message: "Server error processing favorite toggle" });
  }
};
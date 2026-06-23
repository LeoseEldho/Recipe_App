import express from "express";
import {
  getRecipes,
  getRecipesById,
  editRecipes,
  addRecipes,
  deleteRecipes,
  upload,
  toggleFavorite,
} from "../Controller/recipeController.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.get("/data", getRecipes);
router.get("/:id", getRecipesById);
router.post("/add", upload.single("file"), verifyToken, addRecipes);
router.put("/:id", upload.single("file"), verifyToken, editRecipes);
router.delete("/:id", verifyToken, deleteRecipes);
router.put("/favorite/:id", verifyToken, toggleFavorite);

export default router;
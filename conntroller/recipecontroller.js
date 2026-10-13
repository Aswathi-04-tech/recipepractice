
const Recipe = require('../model/recipeModel')

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    // Get recipe data from request body
    const {
      name,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      cuisine,
      caloriesPerServing,
     
    } = req.body;
      if (!req.file) {
      return res.status(400).json({
        message: "Recipe image is required"
      });
    }


    // Validate required fields
    if (
      !name ||
      !ingredients ||
      !instructions ||
      !prepTimeMinutes ||
      !cookTimeMinutes ||
      !servings ||
      !difficulty ||
      !cuisine ||
      !caloriesPerServing 
   
    ) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    // Create a new recipe
    const newRecipe = new Recipe({
      name,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      cuisine,
      caloriesPerServing,
      image: `/uploads/${req.file.filename}`
    });
    

    // Save recipe to MongoDB
    await newRecipe.save();

    // Send response
    return res.status(201).json({
      message: "Recipe created successfully",
      recipe: newRecipe
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



// Get all recipes
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();

    return res.status(200).json({
      message: "Recipes fetched successfully",
      recipes: recipes
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",   
      error: error.message
    });
  }
};
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing recipe
    const existingRecipe = await Recipe.findById(id);

    if (!existingRecipe) {
      return res.status(404).json({
        message: "Recipe not found"
      });
    }

    const {
      name,
      ingredients,
      instructions,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      cuisine,
      caloriesPerServing
    } = req.body;

    // Prepare updated data
    const updateData = {
      name,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      cuisine,
      caloriesPerServing
    };

    // Parse ingredients and instructions
    if (ingredients) {
      updateData.ingredients = JSON.parse(ingredients);
    }

    if (instructions) {
      updateData.instructions = JSON.parse(instructions);
    }

    // Update image only when a new image is uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Update MongoDB
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    return res.status(200).json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({
        message: "Recipe not found"
      });
    }

    return res.status(200).json({
      message: "Recipe deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
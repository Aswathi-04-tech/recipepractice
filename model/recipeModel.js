const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    ingredients: {
      type: [String],
      required: true
    },

    instructions: {
      type: [String],
      required: true
    },

    prepTimeMinutes: {
      type: Number,
      required: true
    },

    cookTimeMinutes: {
      type: Number,
      required: true
    },

    servings: {
      type: Number,
      required: true
    },

    difficulty: {
      type: String,
      required: true
    },

    cuisine: {
      type: String,
      required: true
    },

    caloriesPerServing: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
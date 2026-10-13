const express = require('express');
const usercontroller = require('./conntroller/usercontroller');
const authMiddleware = require('./conntroller/middleware/authMiddleware')
const recipecontroller = require('./conntroller/recipecontroller');

upload = require('./conntroller/middleware/multerMiddleware');

const routes=express.Router();

routes.post('/register',usercontroller.registerUser);
routes.post('/login', usercontroller.loginUser);
routes.get(
  '/profile',
  authMiddleware,
  usercontroller.getProfile
);

routes.get(
  "/getrecipes",authMiddleware,
  recipecontroller.getRecipes
);

routes.post('/recipes',authMiddleware, upload.single("image"),recipecontroller.createRecipe);

routes.put(
  "/recipes/:id",
  authMiddleware, upload.single("image"),
  recipecontroller.updateRecipe
);
routes.delete(
  "/recipes/:id",
  authMiddleware,
  recipecontroller.deleteRecipe
);
module.exports=routes;

const express = require('express');
const router = express.Router();
const recipecontroller = require('../controllers/recipecontroller');

router.get('/', recipecontroller.homepage);
router.get('/recipe/:id', recipecontroller.exploreRecipe);
router.get('/categories', recipecontroller.explorercategories);
router.get('/categories/:id', recipecontroller.explorercategoriesbyid);
router.post('/search', recipecontroller.search);
router.get('/explore-latest', recipecontroller.explorerlatest);
router.get('/random-recipe', recipecontroller.explorerandom);
router.get('/submit', recipecontroller.submit);
router.post('/submit', recipecontroller.submitonpost);
module.exports = router;
require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
// home page 
exports.homepage = async(req,res) =>{
    try{

        const limitnumber = 5;
        const categories = await Category.find({}).limit(limitnumber);
        const latest = await Recipe.find({}).sort({_id:-1}).limit(limitnumber);
        const thai = await Recipe.find({ 'category' : 'Thai' }). limit(limitnumber);
        const american = await Recipe.find({ 'category': 'American' }) .limit(limitnumber);
        const chinese = await Recipe.find({ 'category' : 'Chinese' }). limit(limitnumber);
        const food = {latest,thai,american,chinese};
        res.render('./layouts/index',{title:'Cooking Blog - Home', categories,food});
    }   catch (error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}


// categoreis \
exports.explorercategories = async(req,res) =>{
    try{
        const limitnumber = 20;
        const categories = await Category.find({}).limit(limitnumber);
        res.render('./layouts/categories',{title:'Cooking Blog - categories', categories});
    }   catch (error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}


// categoreis id\
exports.explorercategoriesbyid = async(req,res) =>{
    try{
        let catid = req.params.id;
        const limitnumber = 20;
        const categoriesbyid = await Recipe.find({'category': catid}).limit(limitnumber);
        res.render('./layouts/categories',{title:'Cooking Blog - categories', categoriesbyid});
    }   catch (error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}


// Recipe \
exports.exploreRecipe = async(req,res) =>{
    try{
        let recipeid = req.params.id;
        const recipe = await Recipe.findById(recipeid);
        res.render('./layouts/recipe',{title:'Cooking Blog - Recipe', recipe});
    }   catch (error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}

// search 
exports.search = async(req,res) =>{

    try{
        let searchterm = req.body.searchterm;
        let recipe = await Recipe.find({ $text:{$search:searchterm, $diacriticSensitive: true}});
        res.render('./layouts/search',{title:'Cooking Blog - Search',recipe});
    }catch(error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}
// Explorer latest  
exports.explorerlatest = async(req,res) =>{
    try{
        const limitnumber = 20;
        const recipe = await Recipe.find({}).sort({_id:-1}).limit(limitnumber);
        res.render('./layouts/explore-latest',{title:'Cooking Blog - Recipe', recipe});
    }   catch (error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}


// Explorer Random  
exports.explorerandom = async(req,res) =>{
    try{
        const count = await Recipe.find().countDocuments();
        const random = Math.floor(Math.random()* count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('./layouts/random-recipe',{title:'Cooking Blog - Recipe', recipe});
    }   catch (error){
        res.status(500).send({message:error.message || "Error Occured"});
    }
}

// Search  
exports.submit = async(req,res) =>{
    const infoerror = req.flash('infoErrors');
    const infosubmit = req.flash('infoSubmit');
    res.render('./layouts/submit',{title:'Cooking Blog - Recipe',infoerror,infosubmit});
}

exports.submitonpost = async(req,res) =>{

    try{
        let imageUploadFile;
        let uploadPath;
        let newImageName;
        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files where uploaded.');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/img/'+newImageName;
            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.satus(500).send(err);
            })
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });
        await newRecipe.save();
        req.flash('infoSubmit','Recipe has been added');
        res.redirect('/submit');
    }catch(error){
        req.flash('infoerror',error);
        res.redirect('/submit');

    }    
}










// async function insertdummydata(){
//     try{
//         await Category.insertMany([
//             {
//                 "name": "Thai",
//                 "image": "thai-food.jpg"
//             },
//             {
//                 "name": "American",
//                 "image": "american-food.jpg"
//             },
//             {
//                 "name": "Chinese",
//                 "image": "chinese-food.jpg"
//             },
//             {
//                 "name": "Mexican",
//                 "image": "mexican-food.jpg"
//             },
//             {
//                 "name": "Indian",
//                 "image": "indian-food.jpg"
//             },
//             {
//                 "name": "Spanish",
//                 "image": "spanish-food.jpg"
//             }
//             ]);
//     } catch(error){
//         console.log('err' + error);
//     }
// }
// insertdummydata();


// async function insertdummyrecipedata(){
//     try{
//         await Recipe.insertMany([
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             },
//             {
//                 "name": "Stir-fried vegetables",
//                 "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion,
//                 Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl
//                 Heat your wok until it's really hot. Add a splash of oil - it should start to smoke - then the chilli and onion mix
//                 Source: https:// www.jamieoliver.com/recipes/vegetables-recipes/stir-fried-vegetables/`,
//                 "email" : "hello@raddy.co.uk",
//                 "ingredients": [
//                 "1 clove of garlic",
//                 "1 fresh red chilli",
//                 "3 spring onions",
//                 "1 small red onion",
//                 "1 handful of mangetout",
//                 "a few shiitake mushrooms"
//                 ],
//                 "category": "Chinese",
//                 "image": "stir-fried-vegetables.jpg"
//             }
//         ]);
//     } catch(error){
//         console.log('err' + error);
//     }
// }
// insertdummyrecipedata();
// Here is where we import modules
// We begin by loading Express
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

const app = express();

mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Import the Food model
const Food = require("./models/food.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// routes below
// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

// GET /foods
app.get("/foods", async (req, res) => {
    const allFoods = await Food.find();
    res.render("foods/index.ejs", { foods: allFoods})
  });
  

// GET /foods/new
app.get("/foods/new", (req, res) => {
    res.render("foods/new.ejs");
});
/* no leading slash in render*/

app.get("/foods/:foodId", async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    res.render("foods/show.ejs", { food: foundFood });
  });
  

// POST /foods
app.post("/foods", async (req, res) => {
    if (req.body.isHotCold === "on") {
        req.body.isHotCold = true;
      } else {
        req.body.isHotCold = false;
      }
      await Food.create(req.body);
      res.redirect("/foods"); // redirect to index foods
    });
 /* when we res.redirect we are putting the name of an endpoint
 */ 

 app.delete("/foods/:foodId", async (req, res) => {
    await Food.findByIdAndDelete(req.params.foodId);
    res.redirect("/foods");
  });
  
// GET localhost:3000/foods/:foodId/edit
app.get("/foods/:foodId/edit", async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId);
    res.render("foods/edit.ejs", {
        food: foundFood,
      });
    });
// server.js

app.put("/foods/:foodId", async (req, res) => {
    // Handle the 'isHotCold' checkbox data
    if (req.body.isHotCold === "on") {
      req.body.isHotCold = true;
    } else {
      req.body.isHotCold = false;
    }
    
    // Update the food in the database
    await Food.findByIdAndUpdate(req.params.foodId, req.body);
  
    // Redirect to the food's show page to see the updates
    res.redirect(`/foods/${req.params.foodId}`);
  });
    

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

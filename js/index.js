const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var itemsList = ["Wake Up","Scroll through phone","Sit to learn something new","Eat","Sleep","JDM"];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res) {

  const d = new Date();

  const option = {
    weekday : "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  };


  res.render("index", {theDay: d.toLocaleDateString("en-US", option), items: itemsList});

});

app.post("/", function(req, res){

  itemsList.push(req.body.todoItem);

  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server running on localhost:3000");
});

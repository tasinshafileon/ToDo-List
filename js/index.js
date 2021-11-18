const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var listItems = [];

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine", "ejs")

app.get("/", function(req, res){
  const date = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };

  res.render("index", {dayInfo: date.toLocaleDateString("en-US", options), items: listItems});
});

app.post("/", function(req, res){

  listItems.push(req.body.userListItem);

  res.redirect("/");

});

app.listen(3000, function(){
  console.log("Server is running on localhost:3000");
});

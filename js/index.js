const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/todolistDB");

const listItemsSchema = {
  item: "String"
};

const ListItem = mongoose.model("item", listItemsSchema);

app.get("/", function(req, res){

  const date = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };

  ListItem.find({}, function(err, foundItems){
    res.render("index", {dayInfo: date.toLocaleDateString("en-US", options), items: foundItems});
  });


});

app.post("/", function(req, res){

  if(req.body.userListItem!==""){

    const listItem1 = new ListItem({
      item: req.body.userListItem
    });

    listItem1.save();

  }

  res.redirect("/");

});

app.post("/delete", function(req, res){

  setTimeout(function(){
    ListItem.deleteOne({_id: req.body.checkbox}, function(err){});
    res.redirect("/");
  },1500);



});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on localhost:3000");
});

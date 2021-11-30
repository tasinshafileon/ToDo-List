const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  item: "String"
};

const Item = mongoose.model("item", itemsSchema);

const dynamicListSchema = {
  name: "String",
  items: [itemsSchema]
};

const DynamicList = mongoose.model("dynamicList", dynamicListSchema);

app.get("/", function(req, res) {

  const date = new Date();

  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };

  Item.find({}, function(err, foundItems) {
    res.render("index", {
      title: date.toLocaleDateString("en-US", options),
      items: foundItems
    });
  });

});

app.get("/:dynamicRoute", function(req, res) {

  DynamicList.findOne({name: req.params.dynamicRoute}, function(err, found){
    if(!err){
      if (!found) {
        const dynamicItem1 = new DynamicList({
          name: req.params.dynamicRoute,
          items: [{item: "R"}, {item: "F"}]
        });
        dynamicItem1.save();

        res.redirect("/"+req.params.dynamicRoute);
      }else{
        res.render("index", {
          title: found.name.charAt(0).toUpperCase() + found.name.substr(1).toLowerCase(),
          items: found.items
        });
      }
    }
  });

});

app.post("/", function(req, res) {

  if (req.body.userListItem !== "") {
    const item1 = new Item({
      item: req.body.userListItem
    });

    item1.save();

  }

  res.redirect("/");

});

app.post("/delete", function(req, res) {

  setTimeout(function() {
    Item.deleteOne({
      _id: req.body.checkbox
    }, function(err) {});
    res.redirect("/");
  }, 1000);

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on localhost:3000");
});

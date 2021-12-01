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


const date = new Date();

const options = {
  weekday: "long",
  month: "long",
  day: "numeric"
};

const itemsSchema = {
  item: "String"
};

const Item = mongoose.model("item", itemsSchema);

const dynamicListSchema = {
  name: "String",
  listItems: [itemsSchema]
};

const DynamicList = mongoose.model("dynamicList", dynamicListSchema);

app.get("/", function(req, res) {


  Item.find({}, function(err, foundItems) {
    res.render("index", {
      title: date.toLocaleDateString("en-US", options),
      items: foundItems
    });
  });

});

app.get("/:dynamicRoute", function(req, res) {

  DynamicList.findOne({
    name: req.params.dynamicRoute
  }, function(err, found) {
    if (!err) {
      if (!found) {
        const dynamicItem1 = new DynamicList({
          name: req.params.dynamicRoute,
          items: []
        });
        dynamicItem1.save();

        res.redirect("/" + req.params.dynamicRoute);
      } else {
        res.render("index", {
          title: found.name,
          items: found.listItems
        });
      }
    }
  });

});

app.post("/", function(req, res) {

  const item1 = new Item({
    item: req.body.newListItem
  });

  if (req.body.button === date.toLocaleDateString("en-US", options)) {
    if (req.body.newListItem !== "") {
      item1.save();
    }
    res.redirect("/");
  } else {
    DynamicList.findOne({
      name: req.body.button
    }, function(err, found) {
      found.listItems.push(item1);
      found.save();
    });
    res.redirect("/" + req.body.button);
  }


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

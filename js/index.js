const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://"+process.env.USER_ID+":"+process.env.USER_PASSWORD+"@cluster0.ai3n9.mongodb.net/todolistDB");

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
  Item.find({}, function(err, found) {
    if (!err) {
      res.render("index", {
        title: date.toLocaleDateString("en-US", options),
        items: found
      });
    }
  });
});

app.get("/:dynamicRoute", function(req, res) {
  DynamicList.findOne({name: _.capitalize(req.params.dynamicRoute)}, function(err, found){
    if(!err){
      if(!found){
        const dynamicItem1 = new DynamicList({
          name: _.capitalize(req.params.dynamicRoute),
          items: []
        });
        dynamicItem1.save();
        res.redirect("/"+req.params.dynamicRoute);
      }else{
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
    item1.save();
    res.redirect("/");
  }else{
    DynamicList.findOne({name: req.body.button}, function(err, found){
      if(!err){
        found.listItems.push(item1);
        found.save();
        res.redirect("/"+req.body.button);
      }
    });
  }
});

app.post("/delete", function(req, res) {
  if (req.body.itemTitle === date.toLocaleDateString("en-US", options)) {
    Item.deleteOne({_id: req.body.checkbox}, function(err){
      if(!err){
        res.redirect("/");
      }
    });
  }else{
    DynamicList.findOneAndUpdate({name: req.body.itemTitle},{$pull: {listItems: {_id: req.body.checkbox}}}, function(err, found){
      if(!err){
        res.redirect("/"+req.body.itemTitle);
      }
    });
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on localhost:3000");
});

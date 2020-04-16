const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-sakshi:clustersak5@cluster0-91jym.mongodb.net/todoappDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Make a to do list"
});

const todoitems = [item1];


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(todoitems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("items added to DB successfully");
        }
      });
      res.redirect("/");
    } else {
      let today = new Date();
      let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
      };
      let day = today.toLocaleDateString("en-US", options);

      res.render("list", {
        newListItems: foundItems,
        day: day
      });
    }

  });

  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("en-US", options);

});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save()
  res.redirect("/");

});

app.post("/delete", function(req, res){
  const checkedId = req.body.cbox;
  Item.findByIdAndRemove(checkedId, function(err){
    if(!err){
      console.log("successfully deleted");}
  });
res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Welcome to the server");
})

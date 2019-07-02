const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");

const app = express();

mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://atlasnavi:3u7TREmYj726PGme@yelpcamp-database-4xjxz.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Successfully Connected to the Database");
  });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

const todoSchema = new mongoose.Schema({
  text: String
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/", (req, res) => {
  res.redirect("/todos");
});

app.get("/todos", (req, res) => {
  Todo.find({})
    .then(todos => {
      if (req.xhr) {
        res.json(todos);
      } else {
        res.render("index", { todos });
      }
    })
    .catch(err => console.log(err));
});

app.post("/todos", (req, res) => {
  req.body.todo.text = req.sanitize(req.body.todo.text);
  const formData = req.body.todo;
  Todo.create(formData)
    .then(newTodo => {
      res.json(newTodo);
    })
    .catch(err => {
      console.log(err);
      res.redirect("/todo");
    });
});

app.put("/todos/:id", (req, res) => {
  Todo.findByIdAndUpdate(req.params.id, req.body.todo, { new: true })
    .then(todo => {
      res.json(todo);
    })
    .catch(err => console.log(err));
});

app.delete("/todos/:id", (req, res) => {
  Todo.deleteOne({ _id: req.params.id })
    .then(result => {
      res.json(result);
    })
    .catch(err => console.log(err));
});

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`The Server has Started at Port ${process.env.PORT}!`);
});

const express = require("express");
const server = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const Blog = require("./Model/blog.model");
dotenv.config();

server.use(express.json());
server.use(
  express.urlencoded({ extended: true })
);
server.use(cors());
const port = process.env.PORT || 3030;
const mongoUrl = process.env.MONGO_URL;

server.get('/favicon.ico', (req, res) => res.status(204));

server.get("/blogs", (req, res) => {
  const blogs = Blog.find({}).then((blogs) => {
    res.send(blogs);
  });
});

server.get("/blogs/:id", (req, res) => {
  const blog = Blog.findById(req.params.id)
    .then((blog) => res.send(blog))
    .catch((err) => console.log(err));
});

server.delete("/blogs/:id", (req, res) => {
  const blog = Blog.findByIdAndDelete(
    req.params.id
  )
    .then(res.send("done"))
    .catch((err) => console.log(err));
});
server.post("/blogs/submit", (req, res) => {
  console.log(req.body);
  const blog = Blog.create({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
  })
    .then((blog) => res.send(blog))
    .catch((err) => {
      console.log(err);
    });
});

server.put("/blogs/:id", (req, res) => {
  const blog = Blog.findByIdAndUpdate(
    req.params.id,
    req.body
  )
    .then((updatedBlog) => {
      if (!updatedBlog) {
        return res
          .status(404)
          .send("Blog not found");
      }
      res.send(updatedBlog);
    })
    .catch((err) => console.log(err));
});

server.use('/user',require('./routes/userRoutes'))


mongoose.connect(mongoUrl).then(() => {
  try {
    server.listen(port);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
});

const router = require("express").Router();
const Post = require("../models/Post.model");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");
const { isLoggedIn } = require("../middleware/route-guard");
const axios = require("axios");

// GET route to display form to create post
router.get("/post-create", isLoggedIn, (req, res, next) => {
  res.render("posts/create.hbs", { layout: "layouts/navbar", user: req.session.currentUser });
});

// POST route to create post
router.post(
  "/post-create",
  isLoggedIn,
  fileUploader.single("post-file-upload"),
  (req, res, next) => {
    const { _id } = req.session.currentUser;
    const { title, category, description } = req.body;

    let mediaUrl;
    if (req.file) {
      mediaUrl = req.file.path;
    } else {
      mediaUrl = null;
    }
    // make sure users fill all mandatory fields:
    if (!title || !category || !description) {
      res.render("posts/create.hbs", {
        errorMessage: "Category, title and description must be filled in.", layout: "layouts/navbar", user: req.session.currentUser
      });
      return;
    }

    Post.create({ author: _id, title, category, description, mediaUrl })
      .then((newPost) => {
        // update user's posts array
        return User.findByIdAndUpdate(newPost.author, {
          $push: { posts: newPost._id },
        });
      })
      .then(() => res.redirect("/posts"))
      .catch((error) => next(error));
  }
);

// GET route to display form to edit a post
router.get("/post/:postId/edit", isLoggedIn, (req, res, next) => {
  const { postId } = req.params;

  Post.findById(postId)
    .then((postToEdit) => {
      res.render("posts/edit.hbs", {
        layout: "layouts/navbar",
        post: postToEdit,
        user: req.session.currentUser
      });
    })
    .catch((error) => next(error));
});

// POST route to edit post
router.post(
  "/post/:postId/edit",
  isLoggedIn,
  fileUploader.single("post-file-upload"),
  (req, res, next) => {
    const { postId } = req.params;
    const { title, category, description, existingMedia } = req.body;

    let mediaUrl;
    if (req.file) {
      mediaUrl = req.file.path;
    } else {
      mediaUrl = existingMedia;
    }

    Post.findByIdAndUpdate(
      postId,
      { title, category, description, mediaUrl },
      { new: true }
    )
      .then((updatedPost) => res.redirect(`/post/${updatedPost.id}`))
      .catch((error) => next(error));
  }
);

// POST route to delete a post
router.post("/post/:postId/delete", isLoggedIn, (req, res, next) => {
  const { postId } = req.params;

  Post.findByIdAndDelete(postId)
    .then(() => res.redirect("/profile"))
    .catch((error) => next(error));
});

// GET route to display single post e.g. via profile or main post page
router.get("/post/:postId", isLoggedIn, (req, res) => {
  const { postId } = req.params;

  Post.findById(postId)
    .populate("author")
    .then((thePost) => {
      res.render("posts/post-details.hbs", {
        layout: "layouts/navbar",
        thePost,
        user: req.session.currentUser
      });
    })
    .catch((error) => next(error));
});

// GET route to search all the posts
router.post("/posts", isLoggedIn, (req, res) => {
  const keyword = req.body.keyword;

  Post.find({ $text: { $search: keyword } })
    .then((posts) => {
      console.log("Found this!");
      res.render("posts/posts.hbs", { layout: "layouts/main", posts, user: req.session.currentUser });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});
// GET route to display all the posts and render API info
router.get("/posts", isLoggedIn, async (req, res, next) => {


  const baseWeatherURL = "https://api.open-meteo.com/v1";
  const beaches = [
    {
      name: "Playa de Famara, Lanzarote",
      lat: 29.115780,
      long: -13.556338
    },
    {
      name: "Plage Centrale, Soorts-Hossegor",
      lat: 43.667961,
      long: -1.441647
    },
    {
      name: "Praia do Guincho, Portugal",
      lat: 38.73283320367327,
      long: -9.472498461550432
    },
    {
      name: "Playa de Mundaka, Bizkaia",
      lat: 43.40451046231298,
      long: -2.697596608677475
    },
    {
      name: "Playa del Socorro, Tenerife",
      lat: 28.394702,
      long: -16.602920
    }
  ]

  const endpoints = beaches.map(beach => `${baseWeatherURL}/forecast?latitude=${beach.lat}&longitude=${beach.long}&current_weather=true`)

  const data = await axios.all(endpoints.map((endpoint) =>
    axios.get(endpoint)))

  let beachInformation =
    [
      {
        name: beaches[0].name,
        beachData: data[0].data.current_weather
      },

      {
        name: beaches[1].name,
        beachData: data[1].data.current_weather
      },
      {
        name: beaches[2].name,
        beachData: data[2].data.current_weather
      },
      {
        name: beaches[3].name,
        beachData: data[3].data.current_weather
      },
      {
        name: beaches[4].name,
        beachData: data[4].data.current_weather
      }
    ];
  const { category } = req.query;
  const filter = category ? { category } : {};
  Post.find(filter)
    .sort({ createdAt: -1 })
    .populate("author")
    .then((allPosts) => {
      res.render("posts/posts.hbs", { layout: "layouts/navbar", posts: allPosts, beachInformation, user: req.session.currentUser });
    })
    .catch((error) => next(error));

});

module.exports = router;

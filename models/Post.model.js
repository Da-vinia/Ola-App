const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      min: 2,
      max: 50,
      required: [true, "Title is required."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["sell/rent", "tips", "meetup"],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      max: 100,
    },
    mediaUrl: {
      type: String,
    },
    categoryImage: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);
postSchema.index({ description: "text" });

// postSchema.pre("save", function (next) {
//   switch (this.category) {
//     case "sell/rent":
//       this.categoryImage = "/images/category-post_sell.png";
//       break;
//     case "tips":
//       this.categoryImage = "/images/category-post_tips.png";
//       break;
//     case "meetup":
//       this.categoryImage = "/images/category-post_meetup.png";
//       break;
//     default:
//       this.categoryImage = "/images/category.png";
//   }
//   console.log("Category Image Path:", this.categoryImage);
//   next();
// });

const Post = model("Post", postSchema);

module.exports = Post;

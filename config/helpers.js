const hbs = require("hbs");

hbs.registerHelper("categoryImage", function (category) {
  switch (category) {
    case "sell/rent":
      return "/images/category-post_sell.png";
    case "tips":
      return "/images/category-post_tips.png";
    case "meetup":
      return "/images/category-post_meetup.png";
    default:
      return "/images/default-category.png";
  }
});
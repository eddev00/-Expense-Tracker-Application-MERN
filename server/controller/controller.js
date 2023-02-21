const model = require("../models/model.js");

//get categories
function create_Cat(req, res) {}
const Create = new model.Categories({
  type: "Savings",
  color: "1F3B5C",
});
//

module.exports = {
  create_Cat,
};

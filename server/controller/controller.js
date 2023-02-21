const model = require("../models/model.js");

//post on http://localhost:8080/api/categories
async function create_Cat(req, res) {
  const Create = new model.Categories({
    type: "Investment",
    color: "#FCBE44",
  });

  await Create.save((err) => {
    if (!err) return res.json(Create);
    return res
      .status(400)
      .json({ message: `Error while creating categories ${err}` });
  });
}

//GET on http://localhost:8080/api/categories
async function get_Cat(req, res) {
  let data = await model.Categories.find({});

  let filter = await data.map((v) =>
    Object.assign({}, { type: v.type, color: v.color })
  );

  return res.json(filter);
}

//POST on http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
  if (!req.body) return res.status(400).json("POST HTTP Data not Provided");
  let { name, type, amount } = req.body;

  const create = await new model.Transaction({
    name,
    type,
    amount,
    date: new Date(),
  });

  create.save((err) => {
    if (!err) return res.json(create);
    return res
      .status(400)
      .json({ message: `Error while creating transaction ${err}` });
  });
}

//GET on http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
  let data = await model.Transaction.find({});

  return res.json(data);
}

//DELETE on http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
  if (!req.body)
    return res.status(400).json({ message: "Request body not Found" });
  await model.Transaction.deleteOne(req.body, (err) => {
    if (!err) return res.json("Record Deleted!");
  })
    .clone()
    .catch((err) => {
      res.json("Error while deleting Transaction Error");
    });
}

//GET on http://localhost:8080/api/labels
async function get_Labels(req, res) {
  model.Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "type",
        foreignField: "type",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
  ])
    .then((result) => {
      let data = result.map((v) => {
        console.log(v);
        const obj = Object.assign(
          {},
          {
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info["color"],
          }
        );
        return obj;
      });
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.status(400).json(`lookup collection error ${err}`);
    });
}

module.exports = {
  create_Cat,
  get_Cat,
  create_Transaction,
  get_Transaction,
  delete_Transaction,
  get_Labels,
};

const router = require("express").Router();
const cfmodels = require("../constants");
const authenticate = require("../authenticate");
const User = require("../models/user");

const clarifai = new Clarifai.App({
  apiKey: "979cbc5a281f430d93e5022c05e435",
});

router.get("/:id", authenticate.verifyUser, async (req, res) => {
  const { id } = req.params;
  const { img } = req.query;

  const user = await User.findById(req.user._id);

  const data = await clarifai.models.predict(cfmodels[id], img);

  const { concepts } = data.outputs[0]?.data;

  user.imageModels += 1;
  user.images.push(img);
  await user.save();
  res.json(concepts);
});

module.exports = router;

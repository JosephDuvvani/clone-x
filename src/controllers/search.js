import models from "../models/index.js";

const searchUsers = async (req, res) => {
  const { search } = req.body;
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 10;

  try {
    const users = await models.User.search(search, limit, offset);
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({
      message: "Error searching for users",
      error: err,
    });
  }
};

export { searchUsers };

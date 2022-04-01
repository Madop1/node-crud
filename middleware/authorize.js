const JWT = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(400).json({
      errors: [
        {
          msg: "No token found",
        },
      ],
    });
  }

  try {
    let user = await JWT.verify(token, "hgfysdgbcfi6tft8f76r235vf6f46f");
    req.user = user.email;
    next();
  } catch (error) {
    return res.status(400).json({
      error: [
        {
          msg: "invalid token",
        },
      ],
    });
  }
};

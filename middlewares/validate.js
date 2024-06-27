const jwt = require("jsonwebtoken");

validate = (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization) {
    let token = req.headers.authorization.splict(" ")[1];
    try {
      const verifytoken = jwt.verift(token, "123");
      
      next();
    } catch (error) {
      res.json({ message: error });
    }
  } else {
    res.json({ message: "token not found" });
  }
};
module.exports = validate;

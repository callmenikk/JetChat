const UserScheme = require("../models/UserSchema");

const authenticateUser = async (req, res, next) => {  
  const { requestor, authToken } = req.body;

  try {
    if (
      !requestor ||
      !authToken ||
      authToken == null ||
      requestor == null
    ) {
      return res.status(400).send({
        err: "Invalid arguments",
      });
    }

    UserScheme.findById(requestor, (err, model) => {
      if (err) {
        return res.status(404).send({
          err: "User not found",
        });
      }

      if (model.authToken !== authToken) {
        return res.status(403).send({
          err: "Invalid Authentiction",
        });
      }

      next();
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticateUser;

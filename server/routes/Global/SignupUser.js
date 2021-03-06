const UserScheme = require("../../models/UserSchema");
const router = require("express").Router();
const { hashData } = require("../../utils/hashData");
const { tokenGenerator } = require("../../utils/tokenGenerator");
const CAPTCHA_SECRET = require("../../env.json").CAPTCHA_SECRET
const { getAverageColor } = require('fast-average-color-node');
const {validateURL} = require("../../utils/validateURL")
const fetch = require("node-fetch")
const { verify } = require("hcaptcha");


router.post("/signup", async (req, res) => {
  const { username, profile_src, password, isVerified } = req.body;
  
  try {
    
    if (!username || !password) {
      return res.status(403).send({
        err: "invalid argument",
      });
    }

    if(!username.trim() || !password.trim()){
      return res.status(403).send({
        err: "invalid argument",
      });
    }

    UserScheme.findOne({ username: username.toLowerCase() }, async (err, user) => {
      if(err){
        res.status(400).send({
          err: "weird error occured"
        })
      }

      if (user) {
        return res.status(406).send({
          err: "User already exists",
        }); 
      }

      const verifyAccept = await verify(CAPTCHA_SECRET, isVerified)
      if(!verifyAccept.success){
        return res.status(403).send({
          err: "captcha failed",
        });
      }

      let isImage = false
      
      const validateURLstring = validateURL(profile_src)
      const randomNumber = Math.floor(Math.random() * 32) + 1
      
      if(validateURLstring){
        await fetch(profile_src)
        .then(resp => {if(resp.ok) isImage = true})
        .catch(() => isImage = false)
      }

      const setImage = isImage ? profile_src : `/Avatars/Avatar-${randomNumber}.png`
      let ImageRGB = ""

      if(validateURLstring){
        await getAverageColor(setImage)
			  .then(color => {ImageRGB = color.rgb})
        .catch(() => {ImageRGB = "rgb(136, 136, 136)"})
      }else{
        ImageRGB = "rgb(136, 136, 136)"
      }

      const enc_pass = hashData(password);  
      const authToken = tokenGenerator();


      const newUser = UserScheme({
        username: username.toLowerCase(),
        profile_src: setImage,
        password: enc_pass,
        authToken: authToken,
        main_color: ImageRGB
      });

      newUser
        .save()
        .then((save) => {
          return res.send({
            username: save.username,
            profile_src: save.profile_src,
            client_id: save._id,
            authToken: save.authToken,
            createdAt: save.createdAt
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

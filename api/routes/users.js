const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(401).json("Sadece kendi hesabını güncelleyebilirsin.");
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    const user = await User.findById(req.params.id);
    if (user) {
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json("Kullanıcı silindi");
      } catch (e) {
        res.status(500).json(e);
      }
    } else {
      res.status(404).json("Kullanıcı Bulunamadı");
    }
  } else {
    res.status(401).json("Sadece kendi hesabını silebilirsin.");
  }
});



router.get("/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} =user._doc;
        res.status(200).json(others)

    } catch(e){
        res.status(500).json(e)
    }
})



module.exports = router;

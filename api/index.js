const express = require('express')
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoute = require("./routes/auth")
const usersRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const categoryRoute = require("./routes/categories")
const multer = require('multer')
const cors = require('cors')
const path = require('path')
app.use(cors())

dotenv.config()

app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(console.log("MongoDB Ayağa Kalktı.")).catch(e=>console.log(e))



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,"images")
    },
    filename: function (req, file, cb) {
      cb(null, req.body.name)
    }
})
const upload = multer({ storage: storage })
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("Dosya yüklemesi başarılı.")
})

app.use("/api/auth",authRoute)
app.use("/api/users",usersRoute)
app.use("/api/posts",postRoute)
app.use("/api/categories",categoryRoute)


app.listen("5000",()=>console.log("Backend Ayağa Kalktı."))
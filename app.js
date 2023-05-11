const express = require('express');
const db = require('./config/connection');
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const cors = require('cors');




const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}));

console.log("suii");

app.use('/api/auth', userRoutes);
app.use('/admin/post/video-post',postRoutes)
app.use("/",adminRoutes)

app.get('/admin', (req, res) => {
  console.log("vannade")
    res.json({suii:'Hello World!'});
});

app.listen(4000, () => {
    console.log('Server listening on port 3000');
});

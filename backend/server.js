const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/env");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();
app.use("/api/image", imageRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
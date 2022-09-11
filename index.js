const express = require("express");
const cors = require("cors");

const indexRouter = require("./routes/index");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Starting server on port ${PORT}`));

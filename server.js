const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");
const { ensurePublicFolder } = require("./utils/public");

// const { NODE_ENV } = process.env;
// console.log({ NODE_ENV });

const DB = process.env.DATABASE;
const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (err) => {
  console.log(`Error:  ${err.message}`);
  console.log(`Shutting down the server  due to  uncaught Exception `);
  process.exit(1);
});

ensurePublicFolder();

let server;
mongoose.set("strictQuery", true);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  });

process.on("unhandledRejection", (err) => {
  console.log(`Error:  ${err.message}`);
  console.log(`Shutting down the server  due to unhandled  promise rejection `);
  server?.close(() => {
    process.exit(1);
  });
});

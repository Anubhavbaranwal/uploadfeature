import connect from "./db/Db.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connect()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERRR: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8002, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB at index:", error);
    process.exit(1);
  });

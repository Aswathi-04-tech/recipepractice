const express = require('express');
const cors = require('cors');
const dotenv=require('dotenv').config();
const connectDB=require('./databaseconnetion');
const routes=require('./routes');
const servername=express();

servername.use(express.json());
servername.use(cors({ origin: process.env.CLIENT_URL|| "https://eclectic-fenglisu-bb779a.netlify.app", credentials: true , allowedHeaders: ["Content-Type", "Authorization"]}));

servername.use(routes);
servername.use("/uploads", express.static("uploads"));

const PORT=process.env.PORT || 5000;

servername.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

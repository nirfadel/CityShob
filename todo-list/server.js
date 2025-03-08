const { app, server } = require('./app');
const mongoose = require('mongoose');
require("dotenv").config({ path: __dirname + `\\config.env` }); 

const HOST = process.env.HOST;
const PORT = process.env.PORT || 3000;
const DB =  process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB)
  .then(() => {
    console.log('DB connection successful!');
    
    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

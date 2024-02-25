const mongoose = require('mongoose');

const CONNECTION = process.env.CONNECTION;

mongoose.connect(CONNECTION,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));
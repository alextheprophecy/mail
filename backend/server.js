<<<<<<< HEAD
const dotenv = require("dotenv")
=======
const dotenv = require("dotenv") //setting environment variables s.a. secret key
>>>>>>> 78006f3 (feat(server): created basic server)
let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

dotenv.config()

<<<<<<< HEAD

=======
>>>>>>> 78006f3 (feat(server): created basic server)
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

//routes

<<<<<<< HEAD
=======

>>>>>>> 78006f3 (feat(server): created basic server)
//404
app.use((req, res, next) => {
    res.status(404).send('Error 404!')
});

//Error Handler
app.use((err, req, res, next) => {
    console.error(err.message)
    if (!err.statusCode) err.statusCode = 500
    res.status(err.statusCode).send(err.message)
});


const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})
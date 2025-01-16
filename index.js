const { strictEqual } = require('assert');
const { AsyncResource } = require('async_hooks');
const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    path = require('path');
const { title } = require('process');
const Movies = Models.Movie;
const Users = Models.User;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
mongoose.connect('mongodb://localhost:27017/mymongodb', {useNewUrlParser: true, useUnifiedTopology: true});


app.use(morgan('combines', {stream: accessLogStream}));
app.use(express.static('pubblic/documentation.html'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Weolcome to My Flix app!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});


// Get all Movies
app.get('/movies', async (req, res) => {
    await Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
    });
});

// Return movie data for one movie
app.get('/movies/:Title', async (req, res) => {
    await Movies.findOne({Title: req.params.Title })
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Return data about a director
app.get('/movies/:Director', async (req, res) => {
    await Movies.findOne({Director: req.params.Director })
    .then((movie) => {
        res.json(Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Add a user
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(reqbody.Username + 'already exists');
        } else {
            Users
            .create ({
                Username: req.body.Username,
                Password: req.boddy.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).removeAllListeners(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

// Get all users
app.get('/users', async (req, res) => {
    await Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
    });
});

// Get a user by username
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


// Update a user's info by Username
/*
Required Elements:
Usersname: String
Password: String
Email: String

Not Required:
Birthday: Date
*/

app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username }, {$set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    }, 
    {new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error:' + err);
    });
});

// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({Username: req.params.Username})
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + 'was not found');
        } else {
            res.status(200).send(req.params.Username + 'was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username}, {
        $push: {favoriteMovies: req.params.MovieID}
    },
    {new: true}) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// Allow users to add movies to their list (only return a movie has been added)
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
    } else {
        res.status(400).send("No Such User");
    }
})



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
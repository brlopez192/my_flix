const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
    path = require('path');
const { title } = require('process');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

let users = [
    {
        id: 1,
        name: "Brandon",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Nicole",
        favoriteMovies: [
            "John Wick"
        ]
    }
]

let movies = [
    {
        "Title": "Iron Man 2",
        "Description": "With the world now aware that he is Iron Man, billionaire inventor Tony Stark (Robert Downey Jr.) faces pressure from all sides to share his technology with the military. He is reluctant to divulge the secrets of his armored suit, fearing the information will fall into the wrong hands. With Pepper Potts (Gwyneth Paltrow) and Rhodey (Don Cheadle) by his side, Tony must forge new alliances and confront a powerful new enemy.",
        "Genre": {
            "Name": "Sci-fi"
        },
        "Director": {
            "Name": "John Favreau"
        },
        "ImageURL": "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3546118_p_v10_af.jpg",
    },
    {
        "Title": "Captain America: The Winter Soldier",
        "Description": "After the cataclysmic events in New York with his fellow Avengers, Steve Rogers, aka Captain America (Chris Evans), lives in the nation's capital as he tries to adjust to modern times. An attack on a S.H.I.E.L.D. colleague throws Rogers into a web of intrigue that places the whole world at risk. Joining forces with the Black Widow (Scarlett Johansson) and a new ally, the Falcon, Rogers struggles to expose an ever-widening conspiracy, but he and his team soon come up against an unexpected enemy.",
        "Genre":{
            "Name": "Adventure"
        },
        "Director": {
            "Name": "Joe & Anthony Russo"
        },
        "ImageURL": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTfP_GN63NrHEjZ4unvJbGE7neVs5W_6SlUmYHscaXhUSHMkce3eYBL8eiDbwRt4e0oCv0n"
    },
    {
        "Title": "John Wick",
        "Description": "John Wick is a former hitman grieving the loss of his true love. When his home is broken into, robbed, and his dog killed, he is forced to return to action to exact revenge.",
        "Genre": {
            "Name": "Action"
        },
        "Director": {
            "Name": "Chad Stahelski"
        },
        "ImageURL": "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg"
    }
]

app.use(morgan('combines', {stream: accessLogStream}));
app.use(express.static('pubblic/documentation.html'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Weolcome to My Flix app!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

// Create new User
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send("Users Need Names");
    }
})

// Allow user to Update User Info
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send("No Such User");
    }
})

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

// Allow users to remove a movie from their favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    } else {
        res.status(400).send("No Such User");
    }
});

// Allow a user to deregister
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${id} has been deleted.`);
    } else {
        res.status(400).send("No Such User");
    }
});



// Read
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// Read
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('No Such Movie');
    }
});

// Read
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('No Such Genre');
    }
});

// Read
app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('No Such Director');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
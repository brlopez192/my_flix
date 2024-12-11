const express = require('express'), 
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');
const { title } = require('process');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

let topMovies = [
    {
        title: 'Iron Man 2'
    },
    {
        title: 'Captain America: The Winter Soldier'
    },
    {
        title: 'Fast and Furious'
    },
    {
        title: 'The Dark Knight'
    },
    {
        title: 'The Avengers'
    },
    {
        title: 'Guardians of the Galaxy'
    },
    {
        title: 'Born 2 Race'
    },
    {
        title: 'John Wick'
    },
    {
        title: 'The Expendables'
    },
    {
        title: 'Deadpool & Wolverine'
    }
]

// let myLogger = (req, res, next) => {
//     consol.log(req.url);
//     next();
// };

// let requestTime = (req, res, next) => {
//     req.requestTime = Date.now();
//     next();
// };

// app.use(myLogger);
// app.use(requestTime);

app.use(morgan('combines', {stream: accessLogStream}));
app.use(express.static('pubblic/documentation.html'));

app.get('/', (req, res) => {
    res.send('Weolcome to My Flix app!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies)
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
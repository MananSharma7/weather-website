const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render("index", {
        title: "Weather App",
        name: "Manan Sharma"
    });
})

app.get('/about', (req, res) => {
    res.render("about", {
        title: "About Page",
        name: "Manan Sharma"
    });
})

app.get('/help', (req, res) => {
    res.render("help", {
        title: "Help Page",
        name: "Manan Sharma"
    })
})

app.get('/weather', (req, res) => {
    const useraddress = req.query.address;

    if (!useraddress) {
        return res.send({
            error: "You must provide an address"
        })
    }
    geocode(useraddress, (error, { longitude, latitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(longitude, latitude, (error, forecastData) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                forecast: forecastData,
                location,
                address: useraddress
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render("404", {
        title: "error 404",
        name: "Manan Sharma",
        errorMessage: "Help article not found"
    })
})

app.get('*', (req, res) => {
    res.render("404", {
        title: "error 404",
        name: "Manan Sharma",
        errorMessage: "Page not found"
    })
})

app.listen(8080, () => {
    console.log("Server is up on port 8080");
})
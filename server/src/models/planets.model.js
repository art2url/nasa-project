const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse'); // The parse function can take a CSV file or string and convert it into a more usable format, such as an array of objects or rows, depending on configuration

const planets = require('./planets.mongo');

function isHabitablePlanet(planet) {
    return (
        planet['koi_disposition'] === 'CONFIRMED' && // Exoplanet Archive Disposition
        planet['koi_insol'] > 0.36 && // Insolation Flux min [Earth flux]
        planet['koi_insol'] < 1.11 && // Insolation Flux max [Earth flux]
        planet['koi_prad'] < 1.6 // Planetary Radius max
    );
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(
            path.join(__dirname, '..', '..', 'data', 'kepler-data.csv')
        ) // kepler file source and parse function is the destination for a pipe (readable.pipe(writable))
            .pipe(
                parse({
                    comment: '#', // threat all values with # like a comment
                    columns: true, // returns each row in a csv file as a JS Object with key-value pairs rather than as array of values in a row
                })
            ) // connects two streams together (readable stream source to a writable stream destination)
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(
                    `${countPlanetsFound} habitable planets were found!`
                );
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planets.find(
        {},
        { _id: 0, __v: 0 } // exclude 0, include 1
    );
}

async function savePlanet(planet) {
    try {
        await planets.updateOne(
            // insert + update = upsert (allows to insert only when object doesn't already exist)
            { keplerName: planet.keplerName }, // updateOne finds all matches, if doesn't, inserts second argument
            { keplerName: planet.keplerName },
            { upsert: true }
        );
    } catch (err) {
        console.error(`Could not save planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};

const { parse } = require('csv-parse');
const path = require('path')
const fs = require('fs');

const habitablePlanets = [];
const planets = require('./planets.mongo');


function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    //TODO: Replace below create with Upsert; Update and Insert
                    // habitablePlanets.push(data);
                    // await planets.create({
                    //     keplerName: data.kepler_Name
                    // });
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('end', () => {
                console.log(`${habitablePlanets.length} habitable planets found!`);
                resolve();
            });
    });
}

function getAllPlanets() {
    return habitablePlanets;
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}

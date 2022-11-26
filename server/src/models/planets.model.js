const { parse } = require('csv-parse');
const path = require('path')
const fs = require('fs');

const planets = require('./planets.mongo');
/**
* data.updateOne(
* {filter; if data dont exists, update this block}, 
* {second arg; if data does exists, update this block},
* {upsert: true; })
*/

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36
        && planet['koi_insol'] < 1.11
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
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                reject(err);
            })
            .on('end', async () => {
                resolve();
            });
    });
}

async function getAllPlanets() {
    return await planets.find({}, {
        '_id': 0, '__v': 0,
    });
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}
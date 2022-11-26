const launchesDatabase = require('./launches.mongo');

const launches = new Map();

let lastestFlightNumber = 100;

const launch = {
   flightNumber: 100,
   mission: 'Kepler Exploration X',
   rocket: 'Explorer IS1',
   launchDate: new Date('December 3, 2030'),
   target: 'Kepler-442 b',
   customers: ['NASA', 'ZTM'],
   upcoming: true,
   success: true,
};

saveLaunch(launch);

function existsLaunchWithId(launchId) {
   return launches.has(launchId);
}

async function getAllLaunches() {
   return await launchesDatabase
      .find({}, { '_id': 0, '__v': 0 })
 }

async function saveLaunch(launch) {
   await launchesDatabase.updateOne({
      flightNumber: launch.flightNumber,
   }, launch, {
      upsert: true
   })
}

function addNewLaunch(launch) {
   lastestFlightNumber++;
   launches.set(lastestFlightNumber,
      Object.assign(launch, {
         success: true,
         upcoming: true,
         customers: ['OEDS', 'SPACEX'],
         flightNumber: lastestFlightNumber,
      }));
}

function abortLaunchById(launchId) {
   const aborted = launches.get(launchId);
   aborted.upcoming = false;
   aborted.success = false;

   return aborted;
}

module.exports = {
   getAllLaunches,
   addNewLaunch,
   existsLaunchWithId,
   abortLaunchById,
   saveLaunch,
}
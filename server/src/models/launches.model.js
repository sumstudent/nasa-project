const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function existsLaunchWithId(launchId) {
   return await launchesDatabase
      .findOne({
         flightNumber: launchId
      });
}

async function getLatestFlightNumber() {
   const latestLaunch = await launchesDatabase
      .findOne()
      .sort('-flightNumber');

   if (!latestLaunch) {
      return DEFAULT_FLIGHT_NUMBER;
   }

   return latestLaunch.flightNumber;
}

async function getAllLaunches() {
   return await launchesDatabase
      .find({}, { '_id': 0, '__v': 0 })
}

async function saveLaunch(launch) {
   const planet = await planets.findOne({
      keplerName: launch.target,
   });

   if (planet) {
      await launchesDatabase.findOneAndUpdate({
         flightNumber: launch.flightNumber,
      }, launch, {
         upsert: true
      })
   } else {
      throw new Error('No matching planet found')
   }
}

async function scheduleNewLaunch(launch) {
   const newFlightNumber = await getLatestFlightNumber() + 1;

   const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['OEDS', 'SPACEX'],
      flightNumber: newFlightNumber,
   });

   await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
   const aborted = await launchesDatabase
      .updateOne({
         flightNumber: launchId
      }, {
         upcoming: false,
         success: false,
      })

   return aborted.nModified === 1;
}

module.exports = {
   getAllLaunches,
   existsLaunchWithId,
   abortLaunchById,
   scheduleNewLaunch,
}
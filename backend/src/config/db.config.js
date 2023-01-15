// const {
//     MONGODB_USER,
//     MONGODB_PASSWORD,
//     MONGODB_HOST,
//     MONGODB_DOCKER_PORT,
//     MONGODB_DATABASE,
// } = process.env;

// MONGODB_USER=root
// MONGODB_PASSWORD=123456
// MONGODB_DATABASE=bezkoder_db
// MONGODB_LOCAL_PORT=7017
// MONGODB_DOCKER_PORT=27017
// MONGODB_HOST=mongodb

const MONGODB_HOST = process.env.MONGODB_HOST || "localhost";
const MONGODB_DOCKER_PORT = process.env.MONGODB_DOCKER_PORT || 27017;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "E-GO-db";


module.exports = {
    // url: `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DATABASE}?authSource=admin`,
    // url: `mongodb://root:123456@mongodb:27017/bezkoder_db?authSource=admin`,
    url: `mongodb://${MONGODB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DATABASE}`
};
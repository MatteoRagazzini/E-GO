const MONGODB_HOST = process.env.MONGODB_HOST || "localhost";
const MONGODB_DOCKER_PORT = process.env.MONGODB_DOCKER_PORT || 27017;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "E-GO-db";


module.exports = {
    url: `mongodb://${MONGODB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DATABASE}`
};
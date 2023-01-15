import axios from 'axios';
import authHeader from "@/services/auth-header";


const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const STATION_API = `http://localhost:${SERVER_PORT}/stations`


class StationService {
  getStations() {
    return axios.get(STATION_API,{ headers: authHeader()});
  }
}
export default new StationService();

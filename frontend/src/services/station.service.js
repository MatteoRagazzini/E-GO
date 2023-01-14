import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/stations';

class StationService {
  getStations() {
    return axios.get(API_URL,{ headers: authHeader()});
  }
}
export default new StationService();

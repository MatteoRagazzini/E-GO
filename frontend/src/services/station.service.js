import axios from 'axios';
import authHeader from "@/services/auth-header";

const API_URL = 'http://localhost:3000/api/station/';

class StationService {
  getStation() {
    return axios.get(API_URL + 'retrieve',{ headers: authHeader()});
  }
}

export default new StationService();

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/station/';

class StationService {
  getStation() {
    return axios.get(API_URL + 'retrieve');
  }
}

export default new StationService();

import axios from 'axios';
import authHeader from "@/services/auth-header";

const SERVER_PORT = process.env.SERVER_DOCKER_PORT || 3000;
const STATION_API = `http://localhost:${SERVER_PORT}/reservations`

class ReservationService {

  createReservation(user, station) {
    return axios.post(STATION_API, {user: user, station: station}, {headers: authHeader()})
  }

  deleteReservation(user) {
    return axios.put(STATION_API + '/' + user._id, {headers: authHeader()})
  }
}

export default new ReservationService();

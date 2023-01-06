export default function authHeader() {
  let user = JSON.parse(localStorage.getItem('user'));
  let accessToken = localStorage.getItem('accessToken');

  if (user && accessToken) {
    // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
    return { 'x-access-token': accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}

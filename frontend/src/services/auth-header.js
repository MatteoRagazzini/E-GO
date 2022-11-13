export default function authHeader() {
  console.log('calling header function')
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    console.log('inside access tocken')
    // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
    return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}

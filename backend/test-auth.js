const axios = require('axios');
const tough = require('tough-cookie');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
axiosCookieJarSupport(axios);
(async () => {
  try {
    const jar = new tough.CookieJar();
    const email = `testuser${Date.now()}@example.com`;
    const signup = await axios.post('http://localhost:8000/api/auth/signup', { userName: 'testuser', email, password: 'password123' }, { jar, withCredentials: true });
    console.log('signup', signup.status, signup.data);
    console.log('cookies after signup', await jar.getCookies('http://localhost:8000'));
    const getchannel = await axios.get('http://localhost:8000/api/user/getchannel', { jar, withCredentials: true });
    console.log('getchannel', getchannel.status, getchannel.data);
  } catch (err) {
    if (err.response) {
      console.error('ERR STATUS', err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
})();

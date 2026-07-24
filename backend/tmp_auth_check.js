const axios = require('axios');
(async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error('ERR', e.response && e.response.status, JSON.stringify(e.response && e.response.data));
  }
})();

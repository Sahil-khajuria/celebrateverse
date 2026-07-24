const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function run() {
  try {
    const authRes = await axios.post('http://localhost:8080/api/v1/auth/guest-token');
    const token = authRes.data.token;
    console.log('Token:', token);

    const pageRes = await axios.post('http://localhost:8080/api/v1/pages', {
      recipientName: 'Friend',
      personalMessage: 'Happy Birthday!',
      senderName: 'Someone special',
      theme: 'classic_gold',
      mode: 'QUICK'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Page created:', pageRes.data);
    const pageId = pageRes.data.id;

    fs.writeFileSync('dummy.jpg', 'fake image data');
    const form = new FormData();
    form.append('file', fs.createReadStream('dummy.jpg'));
    form.append('type', 'PHOTO');

    const uploadRes = await axios.post(`http://localhost:8080/api/v1/pages/${pageId}/media`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Upload success:', uploadRes.data);
  } catch (e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}
run();

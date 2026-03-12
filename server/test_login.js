import axios from 'axios';

const testLogin = async () => {
    try {
        const res = await axios.post('http://localhost:3001/auth/login', {
            username: 'admin',
            password: '123'
        });
        console.log('Login Success:', res.data);
    } catch (error) {
        console.log('Login Failed:', error.response ? error.response.status : error.message);
        if (error.response) console.log('Data:', error.response.data);
    }
};

testLogin();

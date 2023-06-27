async function checkIp () {
    try {
        const response = await axios.get('https://api.ipify.org');
        const ipAddress = response.data;
        console.log('Lambda Function IP:', ipAddress);
      } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { checkIp };
function parseResponseBody(response) {
    const detection = JSON.parse(JSON.parse(response.Payload).body);
    console.log(detection);
    return detection;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = { parseResponseBody, capitalize }
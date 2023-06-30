function splitArray(array, m) {
    const chunkSize = Math.ceil(array.length / m);
    return Array.from({ length: m }, (_, i) => array.slice(i * chunkSize, (i + 1) * chunkSize));
}
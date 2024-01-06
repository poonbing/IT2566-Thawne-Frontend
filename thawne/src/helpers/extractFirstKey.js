function extractFirstKey(obj) {
    if (obj && typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length >= 0) {
            return keys[0];
        }
    }
    return null;
}

export default extractFirstKey;
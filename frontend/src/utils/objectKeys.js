/**
 * Maps the keys of an object (inc. nested objects) to an array of strings
 * @param {object} obj
 */
const objectKeys = function (obj, _parents = []) {
    const keys = [];
    for (const key in obj) {
        // Key is not an array but is an object
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            keys.push(...objectKeys(obj[key], [..._parents, key]));
        } else {
            keys.push([..._parents, key].join("."));
        }
    }
    return keys;
};

export default objectKeys;

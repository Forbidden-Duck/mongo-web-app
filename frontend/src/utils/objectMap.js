/**
 * Maps the keys and values of an object (inc. nested objects) to an array of string/value pairs
 * @param {object} obj
 */
const objectMap = function (obj, _parents = []) {
    if (!obj) return {};
    let map = {};
    for (const [key, value] of Object.entries(obj)) {
        // Key is not an array but is an object
        if (typeof value === "object" && !Array.isArray(value)) {
            map = { ...map, ...objectMap(value, [..._parents, key]) };
        } else {
            map[[..._parents, key].join(".")] = value;
        }
    }
    return map;
};

export default objectMap;

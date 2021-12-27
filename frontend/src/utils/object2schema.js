const Ignore = true;
const JSArray = Array;
const JSObject = Object;
const Types = require("./types");

/**
 * @typedef {object} SchemaOptions
 * @property {boolean} [noUndefined]
 * @property {boolean} [noNull]
 * @property {boolean} [keepType] Does not replace invalid types with undefined
 * @property {object} [strictMode]
 * @property {boolean} [strictMode.strictType] Throw error when data is of incorrect type (exc. null & undefined)
 * @property {boolean} [strictMode.strictUndefined] Throw error when data is undefined
 * @property {boolean} [strictMode.strictNull] Throw error when data is null
 */

/**
 * Compare and force an obj to follow the schema rules
 * @template {object} T
 * @template {T} S
 * @param {S} obj
 * @param {T} schema
 * @param {SchemaOptions} [options]
 * @returns {T}
 */
module.exports.compare = (obj, schema, options) => {
    options = typeof options === "object" ? options : {};
    options.strictMode =
        typeof options.strictMode === "object" ? options.strictMode : {};
    const data = Object.assign({}, obj);
    if (!options.keepType) {
        for (const [key, value] of Object.entries(data)) {
            if (!this.compareOne(value, schema[key], options)) {
                if (options.strictMode.strictType) {
                    throw new TypeError(
                        `obj.${key} is not of type ${schema[key]}`
                    );
                } else delete data[key];
            }
        }
    }
    // Add undefined to missing properties if noUndefined is true
    if (!options.noUndefined) {
        for (const [key, value] of Object.entries(schema).filter(
            ([k]) => data[k] === undefined
        )) {
            if (value !== Ignore) data[key] = undefined;
        }
    }
    // Check for undefined and/or null data
    if (options.strictMode.strictUndefined || options.strictMode.strictNull) {
        for (const [key, value] of Object.entries(data)) {
            if (schema[key] !== Ignore) {
                if (options.strictMode.strictUndefined && value === undefined) {
                    throw new TypeError(`obj.${key} can not be undefined`);
                } else if (options.strictMode.strictNull && value === null) {
                    throw new TypeError(`obj.${key} can not be null`);
                }
            }
        }
    }
    // Run schema compare on inner object and array properties
    for (const [key, value] of Object.entries(data)) {
        if (
            Types.checkType2Primitives(value, JSObject) &&
            Types.checkType2Primitives(schema[key], JSObject)
        ) {
            data[key] = this.compare(value, schema[key], options);
        } else if (
            Types.checkType2Primitives(value, JSArray) &&
            Types.checkType2Primitives(schema[key], JSArray)
        ) {
            data[key] = this.compareArray(value, schema[key][0], options);
        }
    }
    return data;
};

/**
 * Compare a single value and type
 * @template {*} T
 * @template {T} S
 * @param {S} arr
 * @param {T} schema
 * @param {SchemaOptions} [options]
 * @returns {boolean}
 */
module.exports.compareOne = (value, schemaType, options) => {
    options = typeof options === "object" ? options : {};
    function checkInstanceOf(v, s) {
        if (
            !Types.checkType2Primitives(v, JSObject) &&
            !Types.checkType2Primitives(v, JSArray) &&
            !Types.checkType2Primitives(s, JSObject) &&
            !Types.checkType2Primitives(s, JSArray) &&
            s !== Ignore
        ) {
            return v instanceof s;
        }
        return false;
    }
    if (options.keepType) {
        return !(
            (value === undefined && options.noUndefined) ||
            (value === null && options.noNull)
        );
    }
    return !(
        !schemaType ||
        (!checkInstanceOf(value, schemaType) && // Check instance and primitives (if one works then continue)
            !Types.checkType2Primitives(value, schemaType) &&
            ![null, undefined].includes(value)) || // Ignore null and undefined
        (value === undefined && options.noUndefined) ||
        (value === null && options.noNull)
    );
};

/**
 * Compare and force an array to follow the schema rules
 * @template {object} T
 * @template {T[]} S
 * @param {S} arr
 * @param {T} schema
 * @param {SchemaOptions} [options]
 * @returns {T[]}
 */
module.exports.compareArray = (arr, schemaType, options) => {
    options = typeof options === "object" ? options : {};
    options.strictMode =
        typeof options.strictMode === "object" ? options.strictMode : {};
    const data = [...arr];
    const index2Delete = [];
    data.forEach((value, index) => {
        if (Types.checkType2Primitives(schemaType, JSObject)) {
            if (Types.checkType2Primitives(value, JSObject)) {
                data[index] = this.compare(value, schemaType, options);
            } else {
                if (options.strictMode.strictType) {
                    throw new TypeError(
                        `arr[${index}] is not of type ${schemaType}`
                    );
                } else index2Delete.push(index);
            }
        } else if (Types.checkType2Primitives(schemaType, JSArray)) {
            if (Types.checkType2Primitives(value, JSArray)) {
                data[index] = this.compareArray(value, schemaType[0], options);
            } else {
                if (options.strictMode.strictType) {
                    throw new TypeError(
                        `arr[${index}] is not of type ${schemaType}`
                    );
                } else index2Delete.push(index);
            }
        } else if (!this.compareOne(value, schemaType, options)) {
            if (options.strictMode.strictType) {
                throw new TypeError(
                    `arr[${index}] is not of type ${schemaType}`
                );
            } else index2Delete.push(index);
        } else if (options.strictMode.strictUndefined && value === undefined) {
            throw new TypeError(`arr[${index}] can not be undefined`);
        } else if (options.strictMode.strictNull && value === null) {
            throw new TypeError(`arr[${index}] can not be null`);
        }
    });
    return data.filter((value, index) => !index2Delete.includes(index));
};

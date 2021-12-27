module.exports.checkType2Primitives = (value, type) => {
    switch (type) {
        case true:
            return true;
        case Array:
            return Array.isArray(value);
        case Boolean:
            return typeof value === "boolean";
        case Number:
            return typeof value === "number";
        case String:
            return typeof value === "string";
        case Object:
            return !!value && value.constructor === Object;
        default:
            // Check if the type itself is a primitive Array or Object
            if (Array.isArray(type)) {
                return Array.isArray(value);
            } else if (!!type && type.constructor === Object) {
                return !!value && value.constructor === Object;
            }
            return false;
    }
};

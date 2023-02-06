module.exports = function (schema) {
    return function (input) {
        const { value, error: err } = schema.validate(input);
        if (err) {
            throw err;
        }
        return value;
    }
}


// module.exports = schema => input => {
//     const { value, error } = schema.validate(input);
//     if (error) {
//         throw error;
//     }
//     return value;
// };
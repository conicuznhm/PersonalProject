module.exports = (mess, code) => {
    const err = new Error(mess);
    err.statusCode = code;
    throw err;
};
const bcrypt = require('bcryptjs');

function compare(string, hashValue) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(string, hashValue, (err, result) => {
            if (!result || err) {
                reject({ status: 403, content: 'Incorrect Password' });
            }
            else {
                resolve();
            }
        });
    });
}

function hash(string) {
    const salt = 5;
    return bcrypt.hash(string, salt);
}

module.exports = {
    compare,
    hash
};

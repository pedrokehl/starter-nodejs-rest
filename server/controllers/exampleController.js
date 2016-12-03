function getProtected(req, res) {
    res.send('Great! You have access for this protected endpoint');
}

function getUnprotected(req, res) {
    res.send('You have free access for this endpoint');
}

module.exports = {
    getProtected,
    getUnprotected
};

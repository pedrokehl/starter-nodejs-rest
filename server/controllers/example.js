function getProtected(req, res, next) {
    res.setResponse('Great! You have access for this protected endpoint');
    next();
}

function getUnprotected(req, res, next) {
    res.setResponse('You have free access for this endpoint');
    next();
}

module.exports = {
    getProtected,
    getUnprotected
};

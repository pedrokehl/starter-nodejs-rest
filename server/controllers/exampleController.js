module.exports = {
    protected: protected,
    unprotected: unprotected
};

function protected(req, res) {
    res.send('Great! You have access for this protected endpoint');
}

function unprotected(req, res) {
    res.send('You have free access for this endpoint');
}
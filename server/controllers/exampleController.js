module.exports = {
    protected: protected,
    unprotected: unprotected
};

function protected(req, res) {
    res.status(200).json('Great! You have access for this protected endpoint').end();
}

function unprotected(req, res) {
    res.status(200).json('You have free access for this endpoint').end();
}
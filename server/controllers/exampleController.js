module.exports = {
    protected: protected,
    unprotected: unprotected
};

function protected(req, res) {
    res.status(200).send({
        message: 'Great! You have access for this protected endpoint'
    });
}

function unprotected(req, res) {
    res.status(200).send({
        message: 'You have free access for this endpoint'
    });
}


exports.user_get = (req, res, next) => {
    res.send('USER INFO SENT');
};
exports.user_post = (req, res, next) => {
    res.send('USER CREATED');
};
exports.user_put = (req, res, next) => {
    res.send('USER INFO UPDATED');
};
exports.user_delete = (req, res, next) => {
    res.send('USER DELETED');
};

module.exports = (req, res, next) => {
    return res.sendFile('robots.txt', { root: 'server/files' });
};
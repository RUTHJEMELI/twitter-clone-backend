const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeaders = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeaders?.startsWith('Bearer')) {
        return res.status(401).json({ message: 'unauthorized' });
    }

    const token = authHeaders.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'unauthorized' });
    } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'forbidden' });
            }
            req.user = decoded;
            console.log(decoded)
            next();
        });
    }
};

module.exports = verifyToken;

import jwt from 'jsonwebtoken';

const verifyJWT = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error(`Greška prilikom projvere JWT tokena: ${err}`);
        return null;
    }
}

const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(400).json({ error: 'Nevaljan JWT token' });
        }

        const token = authorizationHeader.split(' ')[1];
        const decoded = await verifyJWT(token);

        if (!decoded) {
         return res.status(401).json({ error: 'Nevaljan JWT token!' });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(400).json({ error: 'Greška prilikom autentikacije' });
    }
};

export default authMiddleware;
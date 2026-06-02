
import jwt from 'jsonwebtoken';

const adminChecker = (req, res, next) => {

 const authHeader = req.headers.authorization;
    const token =
        req.body?.token ||
        req.query?.token ||
        req.headers['x-access-token']

    if (!token)
        return res.status(401).json({ success:false, message: 'No token provided.' })
    
    jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) return res.status(403).json({success:false,message:'Token not valid.'})
        
        req.loggedUser = decoded;
    });
    if (req.loggedUser && req.loggedUser.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({
            success: false,
            message: 'Accesso negato: richiesti privilegi di amministratore.'
        });
    }
};

export default adminChecker;

import jwt from 'jsonwebtoken';
const adminChecker = (req, res, next) => {
    // req.loggedUser già aggiornato da tokenChecker
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
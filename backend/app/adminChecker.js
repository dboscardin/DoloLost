
import jwt from 'jsonwebtoken';
//controllo che sia admin, va sempre fatto in catena al controllo che sia un utente base
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

import jwt from 'jsonwebtoken';

//controlla l'autenticità del toekn, quindi che l'user sia loggato almeno come user base
const tokenChecker = function(req, res, next) {
    //console.log("tokennn")
    
    // header or url parameters or post parameters
    var token = req.body?.token || req.query?.token || req.headers['x-access-token'];
    //console.log(token)
    if (!token) return res.status(401).json({success:false,message:'No token provided.'})
        // decode token, verifies secret and checks expiration
        jwt.verify(token, process.env.SUPER_SECRET, function(err, decoded) {
        if (err) return res.status(403).json({success:false,message:'Token not valid'})
        else {
            // if everything is good, save in req object for use in other routes
            req.loggedUser = decoded;
            next();
        }
    });
};

export default tokenChecker;
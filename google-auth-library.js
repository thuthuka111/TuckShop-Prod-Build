const {OAuth2Client} = require('google-auth-library'); //it somehow woks
const client = new OAuth2Client('919323797611-t4n8h1jkkhr7vukgctgn0ldomunmu9su.apps.googleusercontent.com');

async function verify(idToken, callback) {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: '919323797611-t4n8h1jkkhr7vukgctgn0ldomunmu9su.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];// use this as the constant with users as emails can change
    payload.userID = userid;
    callback(payload)
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}
exports.verifyID = function (idToken, callback) {
    verify(idToken, function (userInfo) {
        callback(userInfo);
    }).catch(console.error);
}
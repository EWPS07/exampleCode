module.exports = {
    JWT_SECRET: process.env.JWT_SECRET,
    GooglePlus: {
        clientID: process.env.GooglePlusClientID,
        clientSecret: process.env.GooglePlusClientSecret,
    },
    Instagram: {
        clientID: process.env.InstagramClientID,
        clientSecret: process.env.InstagramClientSecret,
    },
    Facebook_Test: {
        userToken: process.env.Facebook_TestUserToken,
        appToken: process.env.Facebook_TestAppToken,
        clientID: process.env.Facebook_TestClientID,
        clientSecret: process.env.Facebook_TestClientSecret,
    },
    Facebook: {
        clientID: process.env.FacebookClientID,
        clientSecret: process.env.FacebookClientSecret,
    },
}
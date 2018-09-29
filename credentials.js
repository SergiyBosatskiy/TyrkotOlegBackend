module.exports = {
    port: 7070,
    cookieSecret: 'thissecretkey',
    tokenConfig: {
        tokenSecret: 'secretForToken',
        refreshTokenSecret: 'anotherSecretTokenForRefresh',
        tokenLife: 18,
        refreshTokenLife: 16
    },
    mongo: {
        development: { connectionString: 'mongodb://localhost/tyrkotShop'},
        production: { connectionString: ''},
    },
};
module.exports = {
    port: 7070,
    cookieSecret: 'thissecretkey',
    tokenConfig: {
        tokenSecret: 'secretForToken',
        refreshTokenSecret: 'anotherSecretTokenForRefresh',
        tokenLife: 1800,
        refreshTokenLife: 3600
    },
    mongo: {
        development: { connectionString: 'mongodb://localhost/tyrkotShop'},
        production: { connectionString: ''},
    },
};
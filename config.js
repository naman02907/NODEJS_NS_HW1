var environment  = {};

environment.staging = {
    'httpPort' : 3000,
    'httpsPort' : 3001,
    'env_name' : 'staging'
};

environment.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'env_name' : 'production'
};

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV.toLowerCase() : '';

var environmentToExport = typeof(environment[currentEnvironment]) == 'object'? environment[currentEnvironment] : environment.staging;

module.exports = environmentToExport;




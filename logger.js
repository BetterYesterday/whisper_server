//to use
//logger.info('This is info');
//logger.error('This is error');
var winston = require('winston');

module.exports = function( filename ){

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level : 'info' // Winston console log level
    }),
    new winston.transports.File({
      level : 'debug',
      json : false, // json 형식으로 로깅을 하지 않는다 (단순 text)
      filename: filename
    })
  ]
});

return logger;
};

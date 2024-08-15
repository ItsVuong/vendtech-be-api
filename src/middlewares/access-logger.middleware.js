const fs = require('fs');
const path = require('path');
const morgan = require("morgan");
const dirname = process.env.ACCESS_LOG_DIR || __dirname;
//setup logger
morgan.token('date', function() {
    var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});
const accessLogStream = fs.createWriteStream(path.join(dirname, 'access.log'), { flags: 'a' })
const logger = morgan(':date :remote-addr :method :url :status :res[content-length] - :response-time ms', { stream: accessLogStream });
console.log(__dirname)
module.exports = logger;
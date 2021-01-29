const colors = require('colors');

// Log green colored text 
const success = (text) => console.log(colors.green(text));

// Log blue colored text 
const info = (text) => console.log(colors.blue(text));

// Log yellow colored text 
const warn = (text) => console.log(colors.yellow(text));

// Log red colored text 
const error = (text) => console.log(colors.red(text));

module.exports = {success, info, warn, error}
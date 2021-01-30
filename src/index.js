const {Crawler} = require('./crawler');
const {checkFooterYear, createWriteStream, closeWriteStream} = require('./utils');

// // Get seed urls to start crawler
// const startUrls = require('./seed-urls.json').urls;

const crawler = new Crawler({
  // startUrls, 
  callback: checkFooterYear,
  beforeRun: createWriteStream,
  afterRun: closeWriteStream,
});


module.exports = {crawler};
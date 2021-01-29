const {Crawler} = require('./crawler');
const {checkFooterYear} = require('./utils');

// Get seed urls to start crawler
const startUrls = require('./seed-urls.json').urls;

const crawler = new Crawler({
  startUrls, 
  callback: checkFooterYear,
  beforeRun: () => console.log('lala')
});

crawler.run();
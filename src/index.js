const {Crawler} = require('./crawler');
const {checkFooterYear} = require('./utils');

const startUrls = [
  'https://www.julieandjessecook.com/',
  'https://threadexperiment.com/',
  'https://www.sugarcandybra.com/blog/breast-shapes',
  'https://uktracking.asendia.com/tracking-dpd.php',
  'https://threadexperiment.com/', 
  'https://www.deutschepost.de/sendung/login.html'
];


const crawler = new Crawler({
  startUrls, 
  callback: checkFooterYear,
  beforeRun: () => console.log('lala')
});

crawler.run();
const {Crawler} = require('./crawler');

const startUrls = [
  'https://www.julieandjessecook.com/',
  'https://threadexperiment.com/',
  'https://www.sugarcandybra.com/blog/breast-shapes',
  'https://uktracking.asendia.com/tracking-dpd.php',
  'https://threadexperiment.com/', 
  'https://www.deutschepost.de/sendung/login.html'
];


const checkFooterYear = async (window) => {
  const footer = window.document.querySelector('footer').textContent; 
  console.log(`Footer ${footer}`);
};


const crawler = new Crawler({
  startUrls, 
  callback: checkFooterYear
});

crawler.run();
const fs = require("fs");
const path = require('path');
const crypto = require('crypto');

// Store value of current year
const currentYear = new Date().getFullYear();


// Create new write stream
const createWriteFileStream = (prefix='footer-check', destDir='store') => {
  // Create a random hash 
  const hash = crypto.randomBytes(10).toString('hex');

  // Create filename (with absoulte path)
  const filename = `${path.resolve(outDir)}/${prefix}-${hash}.json`;

  return fs.createWriteStream(filename,{flags: "w", encoding: "utf8"});
};


const checkFooterYear = async (window) => {
  const yearRegex = /(19|20)\d{2}/g;
  // const copyrightRegex = /(?:©|(?:\(c\))|(?:&copy;))/;
  // const footerYearRegex = new RegExp(`(?=.*${yearRegex.source})(?=.*${copyrightRegex.source}).+`, `im`);
  const footerContents = await getFooterInnerText(window);

  for (let content of footerContents) {
    const match = content.match(yearRegex);
    if(match) {
      console.log(`${match.some(m => m >= currentYear) ? "Up-to-date" : "outdated"}`)
      break;
    }
  }
};

const getFooterInnerText = async (window) => {
  const selectorList = `footer, [class^="footer" i], [id^="footer" i]`;
  return [...window.document.querySelectorAll(selectorList)]
    .map(footer => footer.textContent.replace(/\s/g,''));
};

module.exports = {checkFooterYear};
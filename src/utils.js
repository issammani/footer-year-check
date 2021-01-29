const fs = require("fs");
const path = require('path');
const crypto = require('crypto');

// Store value of current year
const currentYear = new Date().getFullYear();


// Create new write stream
const createWriteFileStream = (prefix='footer-check', outDir='store') => {
  // Create a random hash 
  const hash = crypto.randomBytes(10).toString('hex');

  // Create filename (with absoulte path)
  const filename = `${path.resolve(outDir)}/${prefix}-${hash}.json`;

  // Kind of hacky but works for our use case
  const writeStream = fs.createWriteStream(filename,{flags: "w", encoding: "utf8"});
  writeStream.write('{"urls":['); // Begin JSON Object
  return writeStream;
};


const checkFooterYear = async (window, writeStream) => {
  const yearRegex = /(19|20)\d{2}/g;
  // const copyrightRegex = /(?:©|(?:\(c\))|(?:&copy;))/;
  // const footerYearRegex = new RegExp(`(?=.*${yearRegex.source})(?=.*${copyrightRegex.source}).+`, `im`);
  const footerContents = await getFooterInnerText(window);
  const matches = [];
  for (let content of footerContents) {    
    const yearMatch = content.match(yearRegex);
    
    // A string matching our regex was found
    if(yearMatch) {
      matches.push(yearMatch);
      if(yearMatch.some(m => m >= currentYear)) { 
        console.log("up-to-date");
        return; 
      }
    }
  }

  // Either year wasn't found or outdated
  writeStream.write(JSON.stringify({url: window.location.href, years: [... new Set(matches.flat())]}) + ',');
  console.log("outdated");
};

const getFooterInnerText = async (window) => {
  const selectorList = `footer, [class^="footer" i], [id^="footer" i]`;
  return [...window.document.querySelectorAll(selectorList)]
    .map(footer => footer.textContent.replace(/\s/g,''));
};

module.exports = {checkFooterYear, createWriteFileStream};
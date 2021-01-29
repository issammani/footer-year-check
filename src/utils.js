const fs = require("fs");
const path = require('path');
const crypto = require('crypto');
const {success, info, warn, error} = require('./log');

// Store value of current year
const currentYear = new Date().getFullYear();

// Generate random 10 char string
const generateHash = () => crypto.randomBytes(10).toString('hex');

// Create new write stream
const createWriteStream = (prefix='footer-check', outDir='store') => {
  // Create filename (with absoulte path)
  const filename = `${path.resolve(outDir)}/${prefix}-${generateHash()}.json`;

  // Kind of hacky but works for our use case
  const writeStream = fs.createWriteStream(filename,{flags: "w", encoding: "utf8"});
  // Begin JSON Object
  writeStream.write(`{"urls":[ ${JSON.stringify({url: "placeholder", years: []})}`);
  return writeStream;
};

// Close write stream
const closeWriteStream = (writeStream) => {
  console.log('Terminating JSON object...');
  // Terminate JSON Object
  writeStream.end(']}');
  console.log('Closing stream...');
  console.log('All done');
}


const checkFooterYear = async (window, writeStream) => {
  const yearRegex = /(19|20)\d{2}/g;
  // const copyrightRegex = /(?:©|(?:\(c\))|(?:&copy;))/;
  // const footerYearRegex = new RegExp(`(?=.*${yearRegex.source})(?=.*${copyrightRegex.source}).+`, `im`);
  const footerContents = await getFooterInnerText(window);
  let matches = [];
  for (let content of footerContents) {    
    const yearMatch = content.match(yearRegex);
    
    // A string matching our regex was found
    if(yearMatch) {
      matches.push(yearMatch);
      if(yearMatch.some(m => m >= currentYear)) { 
        info("Footer year is up-to-date");
        return; 
      }
    }
  }


  matches = [... new Set(matches.flat())];
  if(!matches.length) {
    // Footer year wasn't extracted !
    warn("Footer year not found !");
  } else {
    writeStream.write(',' + JSON.stringify({url: window.location.href, years: [... new Set(matches.flat())]}));
    warn("Footer year is outdated");
  }
};

const getFooterInnerText = async (window) => {
  const selectorList = `footer, [class^="footer" i], [id^="footer" i]`;
  return [...window.document.querySelectorAll(selectorList)]
    .map(footer => footer.textContent.replace(/\s/g,''));
};

module.exports = {checkFooterYear, createWriteStream, closeWriteStream, generateHash};
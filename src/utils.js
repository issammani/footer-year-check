
const currentYear = new Date().getFullYear();

const checkFooterYear = async (window) => {
  const yearRegex = /(19|20)\d{2}/g;
  // const copyrightRegex = /(?:©|(?:\(c\))|(?:&copy;))/;
  // const footerYearRegex = new RegExp(`(?=.*${yearRegex.source})(?=.*${copyrightRegex.source}).+`, `im`);
  const footerContents = await getFooterInnerText(window);

  for (let content of footerContents) {
    const match = content.match(yearRegex);
    if(match) {
      console.log(`${match.some(m => m == currentYear) ? "Up-to-date" : "Not up-to-date"}`)
      break;
    }
  }
};

const getFooterInnerText = async (window) => {
  const selectorList = `footer, [class^="footer" i], [id^="footer" i]`;
  return [...window.document.querySelectorAll(selectorList)]
    .map(footer => footer.textContent.replace(/\s/g,''));
};

modules.exports = {checkFooterYear};
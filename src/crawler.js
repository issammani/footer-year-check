const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class Crawler {

  constructor(options = {}) {
    // Keep track of urls
    this.queue = options.startUrls || [];

    // Callback to call when response is received
    this.callback = options.callback ? options.callback.bind(this) : console.log;
  }

  async run() {
    for(let url of this.queue) {
      try{
        const response = await this.fetch(url);
        const dom = await this.parseHTML(url,response);
        const externalLinks = await this.getAllExternalLinks(dom.window);
        this.addUrls(externalLinks);
        await this.callback(dom.window);
      } catch(err) {
        console.warn(`${err.message}`);
      }
    }
  }

  async fetch(url) {
    try { 
      console.log(`[+] Fetching ${url}`);
      return await axios.get(url);
    }catch(err) {
      console.warn(`[-] Error fetching ${url}`);
    } 
  }

  async parseHTML(url, response) {
    try { 
      console.log(`[+] Parsing response from ${url}`);
      return await new JSDOM(response.data, {url});
    }catch(err) {
      console.warn(`[-] Error parsing response from ${url}`);
    } 
  }

  async getAllExternalLinks(window){
    let anchors = await window.document.querySelectorAll("a");
    anchors = [...anchors]
      .map(anchor => anchor.href)
      .filter(href => /^https?:\/\//i.test(href) && !href.includes(window.location.hostname));
    return anchors;
  };

  // Add url to queue
  addUrl(url) {
    this.queue.push(url);
  }

  // Add url array to queue
  addUrls(urls) {
    urls.forEach(this.addUrl.bind(this));
    console.log(`Added ${urls.length} links to queue`);
  }
}

module.exports = {Crawler};
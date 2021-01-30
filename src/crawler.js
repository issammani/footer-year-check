const fs = require('fs');
const path = require('path');
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {generateHash} = require('./utils');
const {success, info, warn, error} = require('./log');
const { SSL_OP_TLS_BLOCK_PADDING_BUG } = require('constants');

class Crawler {

  constructor(options = {}) {
    // Keep track of urls
    this.queue = new Set(options.startUrls);

    // beforeRun (if it exists) should be run once before .run()
    this.beforeRun = options.beforeRun;

    // Store beforeRun return value
    this.beforeRunReturn = null;

    // Callback to call when response is received
    this.callback = options.callback ? options.callback.bind(this) : console.log;

    // afterRun (if it exists) should be run once after .run() or after SIGINT occurs
    this.afterRun = options.afterRun ? options.afterRun.bind(this) : null;

    // Call init
    this.init();
  }

  init() {
    // Add cached urls to queue
    const cache = this.getCache();
    cache && this.addUrls(this.getCache());

    this.beforeRunReturn = this.beforeRun ? this.beforeRun.bind(this).call() : null;
    
    // Detect SIGINT and call .afterRun
    process.on("SIGINT", () => {
      warn('\nSIGINT detected');
      this.end();
      process.exit();
    });
  }

  async run() {
    for(let url of this.queue) {
      try{
        const response = await this.fetch(url);
        const dom = await this.parseHTML(url,response);
        const externalLinks = await this.getAllExternalLinks(dom.window);
        this.addUrls(externalLinks);
        await this.callback(dom.window, this.beforeRunReturn);
      } catch(err) {
        console.warn(`${err.message}`);
      }
      // Remove url from queue
      this.removeUrl(url);
    }

    await this.end();
  }

  async end() {
    // Call afterRun 
    this.afterRun(this.beforeRunReturn);

    info('Caching remaining urls in queue...');
    // Create cache folder if it doesn't exist already
    const cacheDir = `${path.resolve()}/cache`;
    fs.mkdirSync(cacheDir, { recursive: true });
    // Cache urls in queue for next run
    fs.writeFileSync(`${cacheDir}/cached-queue-${generateHash()}.json`,JSON.stringify({urls: [...this.queue]}), { encoding: "utf8" });
    info('Caching done !');
  }

  async fetch(url) {
    try { 
      console.log(`[+] Fetching ${url}`);
      const response = await axios.get(url);
      if(response.headers['content-type'].includes('text/html')){
        return response;
      }else {
        throw Error('Response is not an html file');
      }
    }catch(err) {
      error(`[-] Error fetching ${url}`);
    } 
  }

  async parseHTML(url, response) {
    try { 
      console.log(`[+] Parsing response from ${url}`);
      return await new JSDOM(response.data, {url});
    }catch(err) {
      error(`[-] Error parsing response from ${url}`);
    } 
  }

  async getAllExternalLinks(window){
    let anchors = await window.document.querySelectorAll("a");
    anchors = [...anchors]
      .map(anchor => anchor.href)
      .filter(href => /^https?:\/\//i.test(href) && !href.includes(window.location.hostname));
    return anchors;
  }

  // Return cached urls if they exist
  // By default all cache files are located in cache dir
  // and match cached-queue-{hash}
  getCache() {
    // Get cache dir
    const cache = fs.readdirSync(`${path.resolve('cache')}`);
    // Get latest cache file
    cache.lengh > 0 && cache
      .filter(file => /cached-queue-.*\.json/.test(file))
      .map(file => `${path.resolve('cache', file)}`)
      .reduce((prev, curr) => fs.statSync(prev).ctime > fs.statSync(prev).ctime ? prev : curr);
    return cache.length >= 1 ? require(`${path.resolve('cache', cache[0])}`).urls : null ;
  }

  // Add url to queue
  addUrl(url) {
    this.queue.add(url);
  }

  // Add url array to queue
  addUrls(urls) {
    urls.forEach(this.addUrl.bind(this));
    info(`Added ${urls.length} links to queue`);
  }

  // Remove url from queue
  removeUrl(url) {
    this.queue.delete(url);
  }
}

module.exports = {Crawler};
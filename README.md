# footer-year-check

A crawler that crawls (no surprise there) websites and checks wether the copyright year is up-to-date or not. #OCD


## Installation

```sh
npm i footer-year-check
```

## Usage example
The script doesn't do much aside from fetching, parsing and writing to files.
First you need to get a crawler instance:

```js
const {crawler} = require('footer-year-check');
```

If this is the first time the script is run, it will use the urls from `cache/cached-queue-example.json`. On subsequent runs it will use the most recent cache it generates.

```js
const {crawler} = require('footer-year-check');
crawler.run(); // Will use the urls from `cache/cached-queue-example.json` if this is the first run
```

To add your own urls to the carwler queue you can call `addUrls` method:

```js
const {crawler} = require('footer-year-check');
crawler.addUrls(['https://foo.bar', 'https://bar.baz', 'https://baz.foo']);
crawler.run();
```

> **NB1:** To stop the program you can just hit CTRL-C and the script will save the progress to disk. Otherwise you can use `timeout` to automate the process: 
```sh
timeout --signal=SIGINT 1h npm start # Run for one hour
```

> **NB2:** The results will be stored inside the store dir.

## Release History

* 1.0.0
    * Initial release


## Meta

Issam Mani – [@issam_mn](https://twitter.com/issam_mn) – maniissam.mi@gmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.

## Contributing

1. Fork it (<https://github.com/issammani/footer-year-check/fork>)
2. Create your feature branch (`git checkout -b feat/foo-bar-baz`)
3. Commit your changes (`git commit -am 'feat: bla bla'`)
4. Push to the branch (`git push origin feat/foo-bar-baz`)
5. Create a new Pull Request
6. PR will be reviewed and eventually merged
7. Tada thanks for contributing 🎉🎉🎉
# Maetland Landgoed static site generator

This is the development environment for the new Maetland Landgoed website.

### Prerequisites

You need node.js (https://nodejs.org/en/) and gulp (http://gulpjs.com/) installed to get going.

### Installing

Once you have node.js and gulp ready, install all other dependencies with:

```
npm install
```

When finished installing you can run these npm commands to setup a local server (localhost:8080), watch for changes and generate production ready website files in the dist folder.

```
npm run init
npm run watch
npm run build:prod
```

## Static site generator workings

Evertything you need to modify the website can be found in the scr folder. This folder contains the following parts:

* content
* css
* html
* js
* public

These source files are transformed into the static files needed to run the website. The build folder will contain the static files needed to test the website locally, and the dist folder contains the optimized files for deployment on the server,

### Source files

#### config file

The config.json contains global variables for the website used in the Twig templates. This data will be appended using gulp with the generated Frontmatter data and needed images (see 'content folder' below).

#### content folder

The content folder contains all images and texts needed in the website.

The images can be placed in a couple locations depending on where they are needed in the website. You can place them inside the 'images' folder in the root for globally used assets. Or you can place them in a specific page or section within a page. The first image inside a page (for example pages>p1_home>images>[..].jpg) will be used as the big header image for that page. Always make sure the images placed contain no spaces and and lowercase letters!


All texts for the pages and sections withing pages can be managed through either the page.md or section.md files. These files contain Frontmatter markup (https://www.npmjs.com/package/front-matter). All names attributes between the two '---' delimiters will be available as attribute values inside the HTML, evertyhing below these delimiters is the actual text to be used in the page or section. This text can be either normal text, or HTML markip.


#### css folder

The css folder is globally arranged into a ITCSS file structure (https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/).

The CSS itself is build using CSSnext (http://cssnext.io/) plus some helpful utilities (https://ismamz.github.io/postcss-utilities/docs)

#### html folder

All HTML is generated using Twig (http://twig.sensiolabs.org/), using the Frontmatter data supllied from the content folder.

Right now there is one master layout (layouts/_site.twig) and two pages using that layout (pages/contact.twig and pages/index.twig). The index.twig will contain all content 'pages' and sections from the content folder, and this will result in a single index.html inside the build or dist folder. The contact.twig will become a seperate contact.html page.


#### js folder

The js folder contains all needed javascript. It uses webpack (https://webpack.github.io/) to generate the minimized javascript file to be included in the website, and it uses ES2015 notation transpiled using Babel (https://babeljs.io/docs/learn-es2015/).

The app.js is the starting point for the website, which loads a couple of independant modules and utils. Third pary script uses are jQuery, Slick Slider (http://kenwheeler.github.io/slick/) and (http://masonry.desandro.com/.


#### public folder

The public folder contains all assets which can be copied directly to the website. This includes downloads, some external javascript files and the contact form plus the .htaccess, humans.txt and robots.txt files.


### Development files

#### NPM

Inside the package.json are a couple of commands you can use to generate the website, see the 'scripts' sections. The most important ones are 'npm run init', 'npm run watch' and 'npm run build:prod'

#### Gulp

The gulpfile.babel.js contains all tasks to generate the needed conent for the website. There are three main tasks:

* 'gulp public' which copies the files inside content/public in to the website
* 'gulp images' which generates all needed images
* 'gulp compile' which produces the needed data and compiles the HTML

#### Webpack

You can configure webpack using the webpack.config.js file. This will produce the app.bundle.js script for the website.


## Authors

* **Bob Donderwinkel** - *Initial work* - [bd creations](http://www.bdcreations.nl/)


## Roadmap

* Replace the last remaining jQuery bits with vanilla javascript. This means writing a little 'toggleClass' polyfill which should be easy, and using an alternative for Slick Slider (http://kenwheeler.github.io/slick/). It will reduce the filesize of the the app.bundle.js considerably.

'use strict';

import gulp from 'gulp';
import watch from 'gulp-watch';
import batch from 'gulp-batch';
import rename from 'gulp-rename';
import changed from 'gulp-changed';
import livereload from 'gulp-livereload';
import data from 'gulp-data';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import image from 'gulp-image';
import gulpFn from 'gulp-fn';
import imageResize from 'gulp-image-resize';
import eventStream from 'event-stream';
import frontMatter from 'front-matter';
import del from 'del';
import fs from 'fs';
import path from 'path';
import _ from 'underscore';
import plumber from 'gulp-plumber';
import {argv as args} from 'yargs'; 
import glob from 'glob';
import slug from 'slug';

const sourceDir = './src';
const contentDir = './src/content';
const destinationDir = (args.env === 'production') ? './dist' : './build';
let siteData;

function getPageData(pageName){
    let { [pageName]: pageContent } = siteData.pages;
    let data = Object.assign({}, siteData, {content: pageContent});
    return data;
}

gulp.task('data', () => {
    let stream = gulp.src(`${sourceDir}/config.json`)
    .pipe(data((file) => {
        let config = JSON.parse(String(file.contents));
        let navItems = [].concat(config.navigation.site, config.navigation.projects);

        navItems.forEach((item) => {
            item.id = `id_${slug(item.label, {lower:true})}`;
        });
        return config;
    }))
    .pipe(gulpFn((file) => {
        let config = file.data;
        let data = Object.assign({pages: {}, projects: {}}, config);
        let pages =  glob.sync(`${contentDir}/pages/**/page.md`);
        let files = pages;

        files.forEach((file) => {
            let dirName = path.dirname(file).split(contentDir).pop();
            let split = dirName.split('/');
            let source = split.pop();
            let type = split.pop();
            let images = [];
            let sections = [];

            try{
                images = fs.readdirSync(`${contentDir}/${type}/${source}/images/`);
            } catch (err) {}

            try{
                sections = glob.sync(`${contentDir}/${type}/${source}/sections/**/*.md`);
            } catch (err) {}

            try {
                let fileSource = fs.readFileSync(file, 'utf-8');
                let fileContent = frontMatter(fileSource);
                fileContent.attributes.id =  `id_${slug(fileContent.attributes.title, {lower:true})}`;

                fileContent.attributes.images = [];
                images.forEach((entry) => {
                    if(path.extname(entry) === ".png" || path.extname(entry) === ".jpg" ){
                        fileContent.attributes.images.push(`./images/${type}/${source}/${entry}`);
                    }
                })

                fileContent.attributes.sections = [];
                sections.forEach((section) => {
                    let sSource = fs.readFileSync(`${section}`, 'utf-8');
                    let sContent = frontMatter(sSource);

                    let sDirPath = path.resolve(section, '..');
                    let sDirName = sDirPath.split('/').pop();
                    let sImageFiles = glob.sync(`${sDirPath}/images/*.*`);
                    let sImages = [];

                    sImageFiles.forEach((image) => {
                        if(path.extname(image) === ".png" || path.extname(image) === ".jpg" ){
                            let imageName = path.basename(image);
                            let imagePath = `/images/${type}/${source}/sections/${sDirName}`;
                            sImages.push(`${imagePath}/images/${imageName}`);
                        }
                    });

                    fileContent.attributes.sections.push({
                        content: sContent,
                        images: sImages,
                        type: sContent.attributes.type ? sContent.attributes.type : 'text'
                    });

                })
                // sections.forEach((section) => {
                //     let fSource = fs.readFileSync(`${contentDir}/${type}/${source}/sections/${section}`, 'utf-8');
                //     let fContent = frontMatter(fSource);
                //     fileContent.attributes.sections.push(fContent);
                // })

                let typeData = data[type];
                typeData[source] = fileContent;
            } catch (err) {}
        });

        let siteConfig = fs.readFileSync(`${contentDir}/site.md`, 'utf-8');
        _.extend(data, {env: args.env, site: frontMatter(siteConfig)});
        siteData = data;  

        // console.log(siteData);
    }));

    return stream;
});

gulp.task('pages', ['styles'],() => {
    let twig = require('gulp-twig');

    return gulp.src(`${sourceDir}/html/pages/**/*.twig`)
        .pipe(plumber())
    	.pipe(changed(destinationDir))
        .pipe(data((file) => {
            let pageName = path.basename(file.path, '.twig');
            return getPageData(pageName);
        }))
        .pipe(twig({
            base: `${sourceDir}/html/`,
            functions: [
                {
                    name: "styles",
                    func: function (src) {
                        let styleSource = fs.readFileSync(`${destinationDir}/${src}`, 'utf-8');
                        return styleSource;
                    }
                },
                {
                    name: "source",
                    func: function (src) {
                        let styleSource = fs.readFileSync(`${src}`, 'utf-8');
                        return styleSource;
                    }
                }
            ]
        }))
        .pipe(gulp.dest(destinationDir))
        .pipe(livereload({ }));
});

gulp.task('compile', ['data', 'pages']);

gulp.task('styles', function () {
    // https://ismamz.github.io/postcss-utilities/docs
	const postcss = require('gulp-postcss');
	const sourcemaps = require('gulp-sourcemaps');
	const cssnano = require('cssnano');
	const utilities = require('postcss-utilities'); 
	const cssnext = require('postcss-cssnext');
    const easyImports = require("postcss-easy-import");
	const processors = [
	    easyImports({glob: true}),
        cssnext({browsers: ['last 2 version']}),
        utilities,
        cssnano
    ];

  	return gulp.src([`${sourceDir}/css/**/[^_]*.css`])
  		.pipe(changed(destinationDir))
  		.pipe(gulpif(args.env == 'development', sourcemaps.init()))
    	.pipe(postcss(processors))
    	.pipe(gulpif(args.env == 'development', sourcemaps.write('/maps')))
    	.pipe(gulp.dest(destinationDir + '/css'))
    	.pipe(livereload({ }));
});

gulp.task('site-images', function () {
  return gulp.src(`${contentDir}/images/**/*.*`)
        .pipe(changed(destinationDir))
        .pipe(imagemin({}))
        .pipe(gulp.dest(`${destinationDir}/images`))
});

gulp.task('page-images', function () {
  return gulp.src(`${contentDir}/pages/*/images/*.*`)
        .pipe(changed(destinationDir))
        .pipe(imageResize({
            width : 1600,
            imageMagick: true
        }))
        .pipe(image({
        }))
        .pipe(rename(function (path) {
            let sourceName = path.dirname.split('/').shift();
            path.dirname = `/pages/${sourceName}`;
            return path;
          }))
        .pipe(gulp.dest(`${destinationDir}/images`))
});

gulp.task('section-images', function () {
  return gulp.src(`${contentDir}/pages/**/sections/**/images/*.*`)
        .pipe(changed(destinationDir))
        .pipe(imageResize({
            width : 800,
            imageMagick: true
        }))
        .pipe(image({
        }))
        .pipe(rename(function (path) {
            let sourceName = path.dirname.split('/').shift();
            path.dirname = `/pages/${path.dirname}`;
            return path;
          }))
        .pipe(gulp.dest(`${destinationDir}/images`))
});

gulp.task('images', ['site-images', 'page-images', 'section-images']);

gulp.task('public', function () {
  return gulp.src([`${sourceDir}/public/*.*`, `${sourceDir}/public/.*`])
        .pipe(changed(destinationDir))
        .pipe(gulp.dest(`${destinationDir}/`))
});


gulp.task('watch', ['data'], () => {
    livereload.listen();
    gulp.watch('./gulpfile.babel.js', ['default']);
    gulp.watch(`${sourceDir}/config.json`, ['default']);  
    
    watch(`${sourceDir}/html/**/*.twig`, batch(function (events, done) {
        gulp.start('compile', done);
    }));

    watch(`${sourceDir}/css/**/*.css`, batch(function (events, done) {
        gulp.start('styles', done);
    }));

    watch(`${sourceDir}/content/**/*.*`, batch(function (events, done) {
        gulp.start('compile', done);
    }));

    watch(`${sourceDir}/config.json`, batch(function (events, done) {
        gulp.start('default', done);
    }));
});


// https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
gulp.task('clean', () => {
  return del([
    destinationDir + '/**',
    '!' + destinationDir,
    '!src',
    '!*.*',
  ]);
});


gulp.task('default', ['public', 'images', 'compile']);



/* POSTCSS maybe's

+ https://github.com/maximkoretskiy/postcss-autoreset
+ https://github.com/maximkoretskiy/postcss-initial
+ https://github.com/assetsjs/postcss-assets
+ https://github.com/TrySound/postcss-inline-svg
+ https://github.com/jonathantneal/postcss-write-svg

*/

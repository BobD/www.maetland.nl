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
import gulpFn from 'gulp-fn';
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

function getProjectData(projectName){
    let { [projectName]: pageContent } = siteData.projects;
    let data = Object.assign({}, siteData, {content: pageContent});
    return data;
}

gulp.task('data', () => {
    let stream = gulp.src(`${sourceDir}/config.json`)
    .pipe(data((file) => {
        let config = JSON.parse(String(file.contents));
        let navItems = [].concat(config.navigation.site, config.navigation.projects);

        navItems.forEach((item) => {
            item.id = slug(item.label, {lower:true});
        });
        return config;
    }))
    .pipe(gulpFn((file) => {
        let config = file.data;
        let data = Object.assign({pages: {}, projects: {}}, config);
        let pages =  glob.sync(`${contentDir}/pages/**/page.md`, {});
        // let projects =  glob.sync(`${contentDir}/projects/**/*.md`, {});
        // let files = pages.concat(projects);
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
                sections = fs.readdirSync(`${contentDir}/${type}/${source}/sections/`);
            } catch (err) {}

            try {
                let fileSource = fs.readFileSync(file, 'utf-8');
                let fileContent = frontMatter(fileSource);
                fileContent.attributes.id =  slug(fileContent.attributes.title, {lower:true});

                fileContent.attributes.images = [];
                images.forEach((entry) => {
                    fileContent.attributes.images.push(`./images/${type}/${source}/${entry}`);
                })
                fileContent.attributes.sections = [];
                sections.forEach((section) => {
                    let fSource = fs.readFileSync(`${contentDir}/${type}/${source}/sections/${section}`, 'utf-8');
                    let fContent = frontMatter(fSource);
                    fileContent.attributes.sections.push(fContent);
                })
                let typeData = data[type];
                typeData[source] = fileContent;
            } catch (err) {}
        });

        _.extend(data, {env: args.env});
        siteData = data;  

        console.log(siteData.pages.p1_home.attributes);
    }));

    return stream;
});

gulp.task('projects', () => {
    let twig = require('gulp-twig');
    let files =  glob.sync(`${contentDir}/projects/**/*.md`, {});

    files.forEach((file) => {
        let fileName = path.basename(file, '.md');
        try {
            let fileSource = fs.readFileSync(file, 'utf-8');
            let fileContent = frontMatter(fileSource);
            let projects = {};
            projects[fileName] = fileContent;
            
            gulp.src(`${sourceDir}/html/projects/_project.twig`)
            .pipe(plumber())
            .pipe(changed(destinationDir))
            .pipe(data((file) => {
                return getProjectData(fileName);
            }))
            .pipe(twig({
                base: `${sourceDir}/html/`
            }))
            .pipe(rename({
                dirname: 'projects',
                basename: fileName,
                extname: '.html'
            }))
            .pipe(gulp.dest(destinationDir))
            .pipe(livereload({ }));

        } catch (err) {}
    })
});

gulp.task('pages', () => {
    let twig = require('gulp-twig');

    return gulp.src(`${sourceDir}/html/pages/**/*.twig`)
        .pipe(plumber())
    	.pipe(changed(destinationDir))
        .pipe(data((file) => {
            let pageName = path.basename(file.path, '.twig');
            console.log('pages', pageName);
            return getPageData(pageName);
        }))
        .pipe(twig({
            base: `${sourceDir}/html/`
        }))
        .pipe(gulp.dest(destinationDir))
        .pipe(livereload({ }));
});

// gulp.task('compile', ['data', 'pages', 'projects']);
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
        .pipe(imagemin())
        .pipe(gulp.dest(`${destinationDir}/images`))
});

gulp.task('project-images', function () {
  return gulp.src(`${contentDir}/projects/**/images/*.*`)
        .pipe(changed(destinationDir))
        .pipe(imagemin())
        .pipe(rename(function (path) {
            let sourceName = path.dirname.split('/').shift();
            path.dirname = `/projects/${sourceName}`;
            return path;
          }))
        .pipe(gulp.dest(`${destinationDir}/images`))
});

gulp.task('page-images', function () {
  return gulp.src(`${contentDir}/pages/**/images/*.*`)
        .pipe(changed(destinationDir))
        .pipe(imagemin())
        .pipe(rename(function (path) {
            let sourceName = path.dirname.split('/').shift();
            path.dirname = `/pages/${sourceName}`;
            return path;
          }))
        .pipe(gulp.dest(`${destinationDir}/images`))
});

gulp.task('images', ['site-images', 'project-images', 'page-images']);

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


gulp.task('default', ['compile', 'styles', 'images']);



/* POSTCSS maybe's

+ https://github.com/maximkoretskiy/postcss-autoreset
+ https://github.com/maximkoretskiy/postcss-initial
+ https://github.com/assetsjs/postcss-assets
+ https://github.com/TrySound/postcss-inline-svg
+ https://github.com/jonathantneal/postcss-write-svg

*/

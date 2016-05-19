// Include gulp
var gulp = require('gulp');

// Include Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wiredep = require('wiredep').stream;
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');

var bases = {
 app: 'app/',
 dist: 'dist/',
};

var paths = {
 scripts: ['scripts/app.js', 'scripts/**/*.js'],
 styles: ['styles/*.scss'],
 html: ['index.html'],
 views: ['views/*.html'],
 images: ['images/**/*.*'] 
};

// Process scripts and concatenate them into one output file
gulp.task('scripts', function() {
 gulp.src(paths.scripts, {cwd: bases.app})
 .pipe(plumber())
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(concat('app.min.js'))
 .pipe(sourcemaps.write('../maps'))
 .pipe(gulp.dest(bases.dist + 'scripts/'))
});

// Wiredep 
gulp.task('wiredep', function () {
  gulp.src(paths.html, {cwd: bases.app})
    .pipe(plumber())
    .pipe(wiredep({
      dependencies: true,   
      devDependencies: true
    }))
    .pipe(gulp.dest(bases.app));
    gulp.src(paths.styles, {cwd: bases.app})
    .pipe(plumber())
    .pipe(wiredep({
      dependencies: true,   
      devDependencies: true
    }))
    .pipe(gulp.dest(bases.app + 'styles'));
});

// Copy all other files to dist directly
gulp.task('copy', function() {
 // Copy html
 gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist))
 // Copy views
 gulp.src(paths.views, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'views'))
 // Copy images
 gulp.src(paths.images, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'images'))
// Copy BS fonts
 gulp.src('bower_components/bootstrap-sass/assets/fonts/bootstrap/*.*')
 .pipe(gulp.dest(bases.dist + 'fonts/bootstrap'));

 });


// WATCH
gulp.task('watch', ['browserSync'], function() {
 gulp.watch(paths.scripts, {cwd: bases.app}, ['scripts', 'copy', browserSync.reload]);
 gulp.watch(paths.html, {cwd: bases.app}, ['copy', browserSync.reload]);
 gulp.watch(paths.views, {cwd: bases.app}, ['copy', browserSync.reload]);
 gulp.watch(paths.images, {cwd: bases.app}, ['copy', browserSync.reload]);
 gulp.watch(paths.styles, {cwd: bases.app}, ['sass', browserSync.reload]);
});

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('app/styles/main.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(bases.dist + 'styles'))

});

//browsync

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'dist',
            routes: {"/bower_components": "bower_components"}
        },
        notify: false
    })
});

// Default Task
gulp.task('default', ['wiredep', 'scripts', 'sass', 'copy', 'watch']);
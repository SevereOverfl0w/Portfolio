var Gulp = require('gulp'),
    $ = require('auto-plug')('gulp'),
    Browsersync = require('browser-sync').create(),
    Reload = Browsersync.reload,
    Del = require('del'),
    Source = require('vinyl-source-stream'),
    Buffer = require('vinyl-buffer'),
    Browserify = require('browserify'),
    Watchify = require('watchify');


var opts = Watchify.args;
opts.debug = true;
var b = Watchify(Browserify('./src/js/myohmy.js', opts));
// b.on('update', javascript);
b.on('log', $.util.log);
b.on('error', $.util.log.bind($.util, 'Browserify error'));

function cleanJS(cb){
  Del('./dist/js/', cb);
}

function javascript() {
  return b.bundle()
          // .on('error', function(err){ $.util.log(err); this.end(); })
          .pipe(Source('myohmy.js'))
          .pipe(Buffer())
          .pipe($.size({showFiles: true, title: 'javascript'}))
          .pipe($.rev())
          .pipe(Gulp.dest('./dist/js/'));
}

Gulp.task('javascript', Gulp.series(cleanJS, javascript));

function cleanCSS(cb){
  return Del('dist/css/*', cb);
}

function stylus() {
  return Gulp.src(['src/css/*.styl', '!src/css/_*.styl'])
             .pipe($.stylus({
               use: [require('jeet')(), require('rupture')()],
               'include css': true
             }))
             .pipe($.autoprefixer())
             .pipe($.size({showFiles: true, title: 'stylus'}))
             .pipe($.rev())
             .pipe(Gulp.dest('./dist/css/'));
};

Gulp.task('stylus', Gulp.series(cleanCSS, stylus));

Gulp.task('jade', function() {
  var sources = Gulp.src('./dist/**/*.{css,js}', {read: false});
  return Gulp.src(['src/*.jade'])
             .pipe($.jade())
             .pipe($.inject(sources, {ignorePath: 'dist'}))
             .pipe(Gulp.dest('./dist/'));
});

Gulp.task('clean', function(cb) {
  return Del('./dist', cb)
});

function browserSyncTask() {
  return Browsersync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function watchInit() {
  Gulp.watch('src/css/*.styl', Gulp.series('stylus', 'jade', Reload));
  b.on('update', Gulp.series('javascript', 'jade', Reload));
  Gulp.watch('src/js/*.js', Gulp.series('javascript', 'jade', Reload));
  Gulp.watch('src/{,jade/}*.jade', Gulp.series('jade', Reload));
}

Gulp.task('build', Gulp.series('clean', Gulp.parallel('javascript', 'stylus'), 'jade'));
Gulp.task('watch', Gulp.series('build', Gulp.parallel(browserSyncTask, watchInit)));

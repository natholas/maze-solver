var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();

var paths = {
  pages: ['src/*.html'],
  scripts: ['src/main.ts'],
  styles: ['src/assets/*.css'],
  assets: ['src/assets/*', '!src/assets/*.css']
};

gulp.task('browser-sync', ['browserify', 'copyHtml', 'copyCss', 'copyAssets'], function () {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
});

gulp.task('copyHtml', function () {
  return gulp.src(paths.pages)
    .pipe(gulp.dest('build'));
});

gulp.task('copyAssets', function () {
  return gulp.src(paths.assets)
    .pipe(gulp.dest('build/assets'));
});

gulp.task('copyCss', function () {
  return gulp.src(paths.styles)
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
});

gulp.task('browserify', function() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: paths.scripts,
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform('babelify', {
      presets: ['es2015'],
      extensions: ['.ts']
    })
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
});

gulp.task('watch-ts', ['browserify'], function () {
  browserSync.reload();
})

gulp.task('watch-html', ['copyHtml'], function () {
  browserSync.reload();
})

gulp.task('watch-assets', ['copyAssets'], function () {
  browserSync.reload();
})

gulp.task('watchers', ['browser-sync'], function() {
  gulp.watch(paths.pages, ['watch-html'])
  gulp.watch(['src/*.ts'], ['watch-ts'])
  gulp.watch(paths.assets, ['watch-assets'])
});

gulp.task('default', ['watchers']);
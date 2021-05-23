const chalk = require('chalk')
const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const header = require('gulp-header')
const del = require('del')
const pkg = require('./package.json')

const tpl = `
/*!
* <%= name %> v<%= version %>
* A vanilla javascript plugin that allows you to outline DOM elements like web inspectors
* It's compatible with modern browsers such as Google Chrome, Mozilla Firefox, Safari, Edge and Internet Explorer
* <%= license %> License
* by <%= author %>
*/
`.trimStart()

const paths = {
  srcFile: './src/*.js',
  dist: './dist/'
}

// clean dist folder
gulp.task('clean', function () {
  return del(paths.dist)
})

// watch for changes of source file to build distributable file (only for stage environment)
gulp.task('watch', function () {
  return gulp.watch([paths.srcFile], gulp.series('build'))
})

// generate/build production file in dist folder
gulp.task('build', gulp.series('clean', function () {
  const sourcemaps = require('gulp-sourcemaps')

  return gulp.src(paths.srcFile)
    .pipe(sourcemaps.init())
    .pipe(
      header(tpl, pkg)
    )
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify())
    .pipe(
      header(tpl, pkg)
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist))
    .on('end', function () {
      console.log(chalk.green('Build process has been completed successfully.'))
    })
}))

// run gulp
gulp.task(
  'default',
  gulp.series(
    'clean',
    'build',
    'watch'
  )
)

const config = {
  compress: true,
  style: 'sass',
};

const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const less = require('gulp-less');

const gulpif = require('gulp-if');
const pump = require('pump');

/*
 *    clean任务，删除dist文件夹
 */
gulp.task('clean', () => {
  del('app/dist');
});

/*
 *    style任务，编译CSS文件
 */
gulp.task('style', () => {
  pump([
    gulpif((config.style === 'sass'), gulp.src('app/src/sass/style.scss')),
    gulpif((config.style === 'less'), gulp.src('app/src/less/style.less')),
    gulpif((config.style === 'less'), less()),
    gulpif((config.style === 'sass'), sass()),
    gulp.dest('app/dist/css'),
  ]);
});

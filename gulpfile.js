const config = {
  es6: true,
  style: 'sass',
  compress: false,
};

const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const cssnano = require('gulp-cssnano');
const del = require('del');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const less = require('gulp-less');
const pump = require('pump');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const reload = browserSync.reload;

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
    sourcemaps.init(),
    gulpif((config.style === 'less'), less()),
    gulpif((config.style === 'sass'), sass({
      precision: 10,
    })),
    autoprefixer({
      browsers: ['last 10 Chrome versions', 'Firefox >= 40'],
    }),
    gulpif((config.compress), cssnano()),
    gulpif((config.compress), rename({
      suffix: '.min',
    })),
    sourcemaps.write('./'),
    gulp.dest('app/dist/css'),
    reload({
      stream: true,
    }),
  ]);
});

/*
 *    script任务，编译JavaScript文件
 */
gulp.task('script', () => {
  pump([
    gulp.src('app/src/js/**'),
    sourcemaps.init(),
    gulpif((config.es6), babel()),
    gulpif((config.compress), uglify()),
    gulpif((config.compress), rename({
      suffix: '.min',
    })),
    sourcemaps.write('./'),
    gulp.dest('app/dist/js'),
    reload({
      stream: true,
    }),
  ]);
});

/*
 *    image任务，压缩图片
 */
gulp.task('images', () => {
  pump([
    gulp.src('app/src/images/**'),
    imagemin(),
    gulp.dest('app/dist/images/**'),
  ]);
});

/*
 *    default 任务
 */
gulp.task('default', ['style', 'script'], () => {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
  });

  gulp.watch('app/src/sass/**', ['style']);
  gulp.watch('app/src/less/**', ['style']);
  gulp.watch('app/src/js/**', ['script']);
  gulp.watch('app/src/images/**', ['images']);
  gulp.watch('app/html/**').on('change', reload);
});

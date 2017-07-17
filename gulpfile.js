const config = {
  es6: true,
  style: 'sass',
  compress: false,
};

const gulp = require('gulp');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const gulpif = require('gulp-if');
const pump = require('pump');

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
  gulp.watch('app/html/**').on('change', reload);
});

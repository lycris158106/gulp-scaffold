const gulp = require('gulp');
const del = require('del');

/*
 *    clean任务，删除dist文件夹
 */
gulp.task('clean', () => {
  del('dist');
});


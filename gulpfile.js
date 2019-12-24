//gulpfile.js

var gulp = require('gulp');
var sass = require('gulp-sass');

//style paths
//var sassFiles = '/src/assets/styles/sass/bootstrap.scss';

var sassFiles = [
  'src/styles/bootstrap/bootstrap.scss',
  'src/styles/bootstrap/*.scss',
  'src/styles/components/*.scss',
];

var cssDest = 'public/css/';

gulp.task('styles', function(){
    gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDest));
});

gulp.task('watch',function() {
    gulp.watch(sassFiles,['styles']);
});

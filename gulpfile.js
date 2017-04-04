const gulp = require('gulp')
const rename = require('gulp-rename')

gulp.task('copy', ['copy-js', 'copy-css', 'copy-others'])

gulp.task('copy-js', () => {
  return gulp.src('./client/build/static/js/main.*.js')
          .pipe(rename({
            basename: 'main'
          }))
          .pipe(gulp.dest('./server/views/'))
})

// gulp.task('copy-js-map', () => {
//   return gulp.src('./client/build/static/js/main.*.js.map')
//           .pipe(rename({
//             basename: 'main',
//             extname: '.js.map'
//           }))
//           .pipe(gulp.dest('./server/views/'))
// })

gulp.task('copy-css', () => {
  return gulp.src('./client/build/static/css/main.*.css')
          .pipe(rename({
            basename: 'main'
          }))
          .pipe(gulp.dest('./server/views/'))
})

// gulp.task('copy-css-map', () => {
//   return gulp.src('./client/build/static/css/main.*.css.map')
//           .pipe(rename({
//             basename: 'main',
//             extname: '.css.map'
//           }))
//           .pipe(gulp.dest('./server/views/'))
// })

gulp.task('copy-others', () => {
  return gulp.src('./client/build/*.!(html|json|css.map|js.map)')
          .pipe(gulp.dest('./server/views/'))
})
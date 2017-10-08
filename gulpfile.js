// noinspection JSAnnotator
const
    gulp = require("gulp"),
    minifyCSS = require("gulp-csso"),
    minifyJS = require("gulp-uglify"),
    rename = require("gulp-rename");

gulp.task("css", function() {
    gulp.src('src/css/*.css')
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("dist/css/"));
});

gulp.task("js", function() {
    gulp.src("src/js/*.js")
        .pipe(minifyJS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest("dist/js/"))
});

gulp.task('default', ['css','js']);
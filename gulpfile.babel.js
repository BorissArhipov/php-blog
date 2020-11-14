import gulp from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del';
import browserSync from 'browser-sync';
import zip from 'gulp-zip';

const server = browserSync.create();
const PRODUCTION = yargs.argv.prod;

export const serve = (cb) => {
    server.init({
        proxy:"http://localhost/blog/"
    });
    cb();
};

export const reload = (cb) => {
    server.reload();
    cb();
};

export const clean = () => {
    return del(['dist']);
};

export const styles = () => {
    return gulp.src(['src/css/defaults.scss', 'src/css/reset.scss', 'src/css/style.scss', './node_modules/bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css'])
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(PRODUCTION, cleanCSS({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulp.dest('dist/css'));
};

export const images = () => {
    return gulp.src('src/images/*.{jpg,jpeg,png,svg,gif}')
        .pipe(gulpif(PRODUCTION, imagemin()))
        .pipe(gulp.dest('dist/images'));
};

export const copy = () => {
    return gulp.src(['src/**/*','!src/**/*.scss'])
        .pipe(gulp.dest('dist'));
};

export const watch = () => {
    gulp.watch('src/*.scss', gulp.series(styles, reload));
    gulp.watch('**/*.php', reload);
    gulp.watch('src/image/*.{jpg,jpeg,png,svg,gif}', gulp.series(images, reload));
    gulp.watch(['src/**/*', '!src/{img,js,scss}', '!src/{img,js,scss}/**/*'], gulp.series(copy, reload));
};

export const compress = () => {
    return gulp.src(['**/*', '!node_modules', '!node_modules/**', '!packaged{,/**}', '!src{,/**}', '!.babelrc', '!gulpfile.babel.js', '!package-lock.json', '!package.json'])
     .pipe(zip('blog.zip'))
     .pipe(gulp.dest('dist'));
};

export const dev = gulp.series(clean, gulp.parallel(styles, images, copy), serve, watch);
export const build = gulp.series(clean, gulp.parallel(styles, images, copy));
export const bundle = gulp.series(build, compress);

export const hello = (cb) => {
    console.log('////////////////// HELLO CUPCODE ///////////////////');
    cb();
};

export default hello;
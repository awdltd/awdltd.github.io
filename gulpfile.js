/* Include gulp */
const gulp = require('gulp');

/* Include Our Plugins */
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const scss = require('gulp-sass');
const plumber = require('gulp-plumber');
const minifycss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-tag-include-html');
const svgsprite = require('gulp-svg-sprite');
const webp = require('gulp-webp');

// Format source URL
const PROJECT = 'AWD Playground'
const DEV = '__dev/';
const DIST = '';

/* Concatenate, execute and minify SCSS */
gulp.task('scss', () => {
  gulp.src(`${DEV}scss/style.scss`)
    .pipe(plumber((e) => scss_errors(e)))
    .pipe(scss())
    .pipe(autoprefixer())
    .pipe(rename('style.uncompressed.css'))
    .pipe(gulp.dest(`${DIST}css/`))
    .pipe(rename('style.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(`${DIST}css/`));

  gulp.src([
      `${DEV}scss/noscript.scss`,
      `${DEV}scss/offline.scss`,
      `${DEV}scss/print.scss`
    ])
    .pipe(plumber((e) => scss_errors(e)))
    .pipe(scss())
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(gulp.dest(`${DIST}css/`));
});

/* Concatenate and minify JavaScript */
gulp.task('javascript', () => {
  gulp.src([`${DEV}js/*.js`])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(`${DIST}js/`));
});

gulp.task('images', () => {
  gulp.src([`${DEV}images/**/*.png`, `${DEV}images/**/*.jpg`])
    .pipe(webp())
    .pipe(gulp.dest(`${DIST}images/`));

  gulp.src([`${DEV}images/**/*`, `!${DEV}images/sprites/**/*`])
    .pipe(plumber())
    .pipe(gulp.dest(`${DIST}images/`))

  // Create SVG sprites
  gulp.src([`${DEV}images/sprites/**/*`])
    .pipe(plumber())
    .pipe(svgsprite({
      mode: {
        symbol: {
          render: {
            css: false,
            scss: false
          },
          dest: '',
          prefix: '.sprite-%s',
          sprite: 'icons.svg',
          example: false
        }
      }
    }))
    .pipe(gulp.dest(`${DIST}images/`));
});

gulp.task('html', function() {
  gulp.src(`${DEV}html/index.html`)
    .pipe(plumber())
    .pipe(include())
    .pipe(gulp.dest(`${DIST}`));
});

/* Set default for first GULP execution */
gulp.task('default', ['scss', 'javascript', 'images', 'html'], () => {
  gulp.watch([`${DEV}scss/**/*.scss`], ['scss']);
  gulp.watch([`${DEV}js/**/*.js`], ['javascript']);
  gulp.watch([`${DEV}images/**/*`], ['images']);
  gulp.watch([`${DEV}html/**/*`], ['html']);
});


/*
 *  Below are logs for error handling and naming.
 *  First, add title when GULP is called, for easier referencing */
console.log(`\x1b[33m --------------------------------------------`);
console.log(`  ${PROJECT} `);
console.log(` --------------------------------------------\x1b[0m`);

/* Error handling functions */
function scss_errors(e) {
  console.log(`\x1b[41m WARNING \x1b[0m`);
  console.log(` ${e.messageOriginal} (line ${e.line}, column${e.column})`);
  console.log(` \x1b[33m${e.relativePath}\x1b[0m`);
}

axis         = require 'axis'
jeet            = require 'jeet'
dynamic_content = require 'dynamic-content'
browserify      = require 'roots-browserify'
rupture      = require 'rupture'
autoprefixer = require 'autoprefixer-stylus'
js_pipeline  = require 'js-pipeline'
css_pipeline = require 'css-pipeline'

module.exports =
  ignores: ['readme.md', '**/layout.*', '**/_*', '.gitignore', 'ship.*conf', '**/*/.*.swp', '**/*/*~']

  extensions: [
    js_pipeline(files: 'assets/js/*.coffee', out: 'js/build.js', minify: true, hash: true),
    browserify(files: 'assets/js/myohmy.js', out: 'js/build.js', minify: true)
    css_pipeline(files: 'assets/css/*.styl', out: 'css/build.css', hash: true)
    dynamic_content()
  ]

  stylus:
    use: [axis(), rupture(), autoprefixer(), jeet()]

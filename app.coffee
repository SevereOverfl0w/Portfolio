axis            = require 'axis'
jeet            = require 'jeet'
dynamic_content = require 'dynamic-content'
browserify      = require 'roots-browserify'
rupture         = require 'rupture'
autoprefixer    = require 'autoprefixer-stylus'
js_pipeline     = require 'js-pipeline'
css_pipeline    = require 'css-pipeline'

module.exports =
  ignores: ['readme.md', '**/layout.*', '**/_*', '.gitignore', 'ship.*conf', '**/*/.*.swp', '**/*/*~']

  extensions: [
    js_pipeline(files: 'assets/js/*.coffee'),
    browserify(files: 'assets/js/myohmy.js', out: 'js/build.js')
    css_pipeline(files: 'assets/css/*.styl'),
    dynamic_content()
  ]

  stylus:
    use: [axis(), rupture(), autoprefixer(), jeet()]
    sourcemap: true

  'coffee-script':
    sourcemap: true

  jade:
    pretty: true

var path            = require('path');
var fs              = require('fs');
var _               = require('underscore');

module.exports = Wallpaper;

function Wallpaper(views, start_path) {
  this.start_path = start_path;
  this.initialize(views);
}

Wallpaper.prototype.initialize = function(views) {
  this.compiled = {};
  Object.keys(views).forEach(function(key) {
    this.compiled[key] = this._compile(views[key]);
  }.bind(this));
}

Wallpaper.prototype.middleware = function() {
  var self = this;
  return function(req, res, next) {
    res.templates = self.compiled;
    next();
  }
}

Wallpaper.prototype._getPathParts = function(partial_path) {
  var path_parts = partial_path.split('/');
  path_parts[path_parts.length - 1] += '.ejs';
  return path_parts;
}

Wallpaper.prototype._compile = function(partial_path) {
  var all_parts = [this.start_path].concat(this._getPathParts(partial_path));
  var full_path = path.join.apply(path, all_parts);
  return _.template(fs.readFileSync(full_path, 'utf8'));
}

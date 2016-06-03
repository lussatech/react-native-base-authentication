'use strict';

var     fs = require('fs')
  ,   path = require('path')
  , source = path.resolve('node_modules', 'react-native-base-authentication')
  , target = path.resolve(process.cwd(), 'lib')
  , ignore = ['cli.js', 'package.json', 'readme.md', 'preview.gif'];

function run() {
  try {
    var packages = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8')) || undefined;
  } catch (e) {
    console.error('package.json couldn\'t be found, maybe `%s` is not the root of project directory', process.cwd());
    process.exit(1);
  } finally {
    var hasReactNative = packages.dependencies.hasOwnProperty('react-native');

    if (hasReactNative) {
      writing(source, target);
    } else {
      console.error('react-native dependencies couldn\'t be found, maybe `%s` is not the root of react-native project directory', process.cwd());
      process.exit(1);
    }
  }
}

function writing(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  copyFolderSync(source, target);
}

function copyFileSync(source, target) {
  var targetFile = target;

  if (ignore.indexOf(path.basename(source)) > -1) return;

  if(fs.existsSync(target)) {
    if(fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderSync(source, target) {
  var files = [];
  var targetFolder = path.join(target, path.basename(source));

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  if(fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      var curSource = path.join(source, file);

      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

module.exports = {
  run: run
};

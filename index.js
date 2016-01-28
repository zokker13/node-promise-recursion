'use strict';

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const _ = require('underscore');


const fsStat = Promise.promisify(fs.stat);
const fsReaddir = Promise.promisify(fs.readdir);

function listStuff(folder, list) {

  let deferred = Promise.defer();

  fsReaddir(folder)
    .then((files) => {
      let calls = [];
      _.each(files, (file) => {
        calls.push(fsStat(path.join(folder, file)));
      });

      Promise.all(calls)
        .then((values) => {
          let subs = [];

          _.each(values, (value, index) => {
            if (value.isDirectory()) {
              subs.push(listStuff(path.join(folder, files[index]), list));
            } else {
              list.push(files[index]);
            }
          });

          return Promise.all(subs);
        })
        .then((subValues) => {
          deferred.resolve();
        })
        .catch((err) => {
          console.log(`fuck ${err}`);
        });
    })
    .catch((err) => {
      console.log(`fuuu`);
    });

  return deferred.promise;
}

let kek = [];
listStuff(__dirname + '/sample', kek)
  .then(() => {
    console.log(`done`);
    console.log(kek);
  })
  .catch((err) => {
    console.error(`wtf`);
    console.trace(err);
  });

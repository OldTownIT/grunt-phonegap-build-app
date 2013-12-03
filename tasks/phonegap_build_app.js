/*
 * grunt-phonegap-build-app
 * https://github.com/OldTownIT/grunt-phonegap-build-app
 *
 * Copyright (c) 2013 Andrew Huling
 * Licensed under the MIT license.
 */

'use strict';

var FormData = require('form-data');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
    function run(options, done) {
        createApp(options);
        done();
    }


    function createApp(options) {
        grunt.log.ok('Uploading ' + options.archive + ' file to PhoneGap...');
        var url = 'https://build.phonegap.com/api/v1/apps';
        var form = new FormData();
        form.append('data', '{"title": "' + options.appName + '", "keys": {"android": {"id": ' + options.keys.android.key_id + ', "key_pw": "' + options.keys.android.key_pw + '", "keystore_pw": "' + options.keys.android.keystore_pw + '"}, "ios": {"id": ' + options.keys.ios.key_id + ', "password": "' + options.keys.ios.password + '"}}, "private": true, "create_method": "file"}');
        form.append('file', fs.createReadStream(options.archive));
        form.submit('https://build.phonegap.com/api/v1/apps', function(err, res) {
            res.resume();
            grunt.log.ok('Upload successful!');
        });
    }

//    function updateApp(f, options) {
//        request.put({url: 'https://build.phonegap.com/api/v1/apps/' + options.app_id, body: fs.createReadStream(f)});
//    }

//                    archive: 'build/' + grunt.option('app-name') + '.zip',
//                    appName: grunt.option('app-name'),
//                    user: {
//                        email: '<%= gruntConfig.PhoneGapBuildUsername %>',
//                        password: '<%= gruntConfig.PhoneGapBuildPassword %>'
//                    },
//                    keys: {
//                        ios: {
//                            password: '<%= gruntConfig.iOSKeyPassword %>'
//                        },
//                        android: {
//                            key_pw: '<%= gruntConfig.AndroidKeyPassword %>',
//                            keystore_pw: '<%= gruntConfig.AndroidKeystorePassword %>'
//                        }
//                    },
//                    download: {
//                        ios: 'dist/' + grunt.option('code') + '/ios.ipa',
//                        android: 'dist/' + grunt.option('code') + '/android.apk'
//                    }


    grunt.registerMultiTask("phonegap-build", "Creates a ZIP archive and uploads it to build.phonegap.com to create a new build", function (args) {
        var options = this.options({
            timeout: 60000,
            pollRate: 15000
        });

        if (!grunt.file.exists(options.archive)) {
            grunt.log.fail("Archive at " + options.archive + " does not exist!");
            return false;
        }

        var done = this.async();
        run(options, done);
    });
};
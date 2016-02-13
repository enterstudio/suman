/**
 * Created by amills001c on 12/16/15.
 */



//#config
const config = require('univ-config')(module, '*suman*', 'server/config/conf');

//#core
const express = require('express');
const router = express.Router();
const path = require('path');
const appRootPath = require('app-root-path');
const fs = require('fs');
const os = require('os');


//#helpers
const helpers = require('./helpers');
const findSumanServer = require('../../lib/find-suman-server');


router.post('/done/:run_id', function (req, res, next) {

    var data = body.data;

    try {
        var json = JSON.stringify(data.test);

        if (data.outputPath) {
            fs.appendFileSync(data.outputPath, json += ','); //we write synchronous because we have to ensure data doesn't get malformed in files on disk
            req.sumanData.success = {msg: 'appended data to ' + data.outputPath};
        }
        else{
            console.error(new Error('no outputPath property on data: ' + data).stack);
        }
        next();
    }
    catch (err) {
        next(err);
    }
});


router.post('/finalize', function (req, res, next) {

    var body = req.body;
    var rendered = body.rendered;
    //var config = body.config;
    var timestamp = body.timestamp;

    try {

        var outputDir = config.suman_server_config.outputDir;

        if (!outputDir) {
            console.error('no outputDir defined');
            return next(new Error('no outputDir defined'));
        }

        var outputPath = path.resolve(outputDir + '/' + timestamp + '/temp.html');

        fs.writeFile(outputPath, rendered, (err) => {
            if (err) {
                console.log(err.stack);
                next(err);
            }
            else {
                res.json({success: 'wrote rendered .ejs file'});
            }
        });

    }
    catch (err) {
        next(err);
    }
});


router.post('/make/new', function (req, res, next) {

    var body = req.body;
    //var config = body.config;
    var timestamp = body.timestamp;

    try {
        var outputDir = config.suman_server_config.outputDir;

        if (!outputDir) {
            console.error('no outputDir defined');
            return next(new Error('no outputDir defined'));
        }

        var outputPath = path.resolve(outputDir + '/' + timestamp);

        fs.mkdir(outputPath, function (err) {
            if (err) {
                console.error(err.stack);
                next(err);
            }
            else {
                console.log('created dir at ' + outputPath);
                req.sumanData.success = {msg: 'created dir at ' + outputPath};
                next();
            }

        });
    }
    catch (err) {
        next(err);
    }
});


router.get('/latest', function (req, res, next) {

    try{
        var outputDir = config.suman_server_config.outputDir;

        if (!outputDir) {
            console.error('no outputDir defined');
            return next(new Error('no outputDir defined'));
        }

        var folder = path.resolve(outputDir);
        var runId = helpers.getPathOfMostRecentSubdir(folder);

        if (runId) {
            var file = path.resolve(folder, runId, 'temp.html');
            console.log('***:', file);
            res.sendFile(file, {
                maxAge: 4
            },function(err){
                if(err){
                    next(err);
                }
            });
        }
        else {
            next(new Error('no latest results exist'));
        }

    }
    catch(err){
        next(err);
    }

});

router.get('/:run_id/:test_num', function (req, res, next) {


    try{
        var outputDir = config.suman_server_config.outputDir;

        if (!outputDir) {
            console.error('no outputDir defined');
            return next(new Error('no outputDir defined'));
        }

        var folder = path.resolve(outputDir);

        var runId = req.params.run_id;
        var testNum = req.params.test_num;

        res.sendFile(path.resolve(folder, runId, testNum), {
            maxAge: '58h'
        });
    }
    catch(err){
        next(err);
    }


});

router.get('/:run_id', function (req, res, next) {


    try{
        var outputDir = config.suman_server_config.outputDir;

        if (!outputDir) {
            console.error('no outputDir defined');
            return next(new Error('no outputDir defined'));
        }

        var folder = path.resolve(outputDir);

        var runId = req.params.run_id;

        var file = path.resolve(folder, runId, 'temp.html');
        console.log(file);
        res.sendFile(file);
    }
    catch(err){
        next(err);
    }


});



module.exports = router;
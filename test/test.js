const newman = require('newman');
const assert = require('chai').assert;
const utilityService = require('./../app/module/service/utilityservice');

newman.run({
    collection: require('C:\\Users\\Dell\\Documents\\project_collection.json'),
    iterationData: [{ "var": "data", "var_beta": "other_val" }],
    globals: {

    },
    environment: {

    },
    color: "on",

}).on('start', function (err, args) { // on start of run, log to console
    console.log('running a collection...');
}).on('done', function (err, summary) {

    let countofsuccess = 1;
    let countoffailure = 1;
    if (err || summary.error) {
        console.error('collection run encountered an error.');
    }
    else {
        summary.run.executions.forEach(element => {

            element.assertions.forEach((assertationelement) => {
                if (assertationelement.error == undefined) {
                    utilityService.log(countofsuccess + " " + element.item.parent().name + element.item.name + "'s test case name:-" + assertationelement.assertion + " successed.", 2);
                    countofsuccess++;
                }
            });


        });
        summary.run.failures.forEach(element => {
            // console.log(element.item.parent().name+element.item.name +" successed.");
            utilityService.log(countoffailure + " " + element.parent.name + element.source.name + "'s test case name:-" + element.error.test + "is failed.Error:-" + element.error.message + "and stack trace is " + element.error.stack, 3);
            countoffailure++;
        });
        console.log('collection run completed.');
    }
});
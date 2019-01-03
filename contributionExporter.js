var db = require('./db');
var deposits = require('./models/deposits');
var contributions = require('./models/contributions');
var moment = require('moment');
var fs = require('fs');

db.connect(db.MODE_TEST, function(err) {
    if (err) {
        console.log('ERROR::Unable to connect to MySQL.');
        process.exit(1);
    } else {
        console.log('DEBUG::Connected to MySQL.');
    }
});

var getValue = function(month, hash) {
    var value = hash[month];
    if (value === null || value === undefined) {
        return '0';
    } else {
        return value;
    }
};

contributions.getContributionReport(function(err, report) {
    var reportHash = {};
    for (var i = 0; i < report.length; i++) {
        if (reportHash[report[i].id] === undefined) {
            reportHash[report[i].id] = {};
        }
        reportHash[report[i].id][moment(new Date(report[i].date)).format("M")] = report[i].plannedAmount;
    }
    console.log("Deposit Status:" + JSON.stringify(reportHash));

    var fd = fs.openSync('contributionReport_' + moment().format('YYYYMMDDHHmmss'), 'w');
    fs.writeSync(fd, 'memberID,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,Jan,Feb,Mar\n');

    for (var memberID in reportHash) {
        var line = '' + memberID;
        if (!reportHash.hasOwnProperty(memberID)) {
            continue;
        }
        line += ',' + getValue('4', reportHash[memberID]);
        line += ',' + getValue('5', reportHash[memberID]);
        line += ',' + getValue('6', reportHash[memberID]);
        line += ',' + getValue('7', reportHash[memberID]);
        line += ',' + getValue('8', reportHash[memberID]);
        line += ',' + getValue('9', reportHash[memberID]);
        line += ',' + getValue('10', reportHash[memberID]);
        line += ',' + getValue('11', reportHash[memberID]);
        line += ',' + getValue('12', reportHash[memberID]);
        line += ',' + getValue('1', reportHash[memberID]);
        line += ',' + getValue('2', reportHash[memberID]);
        line += ',' + getValue('3', reportHash[memberID]);
        fs.writeSync(fd, line + '\n');
    }

    fs.closeSync(fd);
});
var db = require('../db.js');

exports.getForPlanID = function (planID, done) {
    db.get().query("SELECT id, DATE_FORMAT(date, '%Y-%m-%d') as contribution_date FROM contributions where plan_id=" + planID + " order by date DESC limit 1", function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.updateContributions = function (contributionEntries) {
    var nEntries = 0;
    var values = '';
    for (var planID in contributionEntries) {
        nEntries++;
        var contributionDates = contributionEntries[planID];
        contributionDates.forEach(function (date) {
            values += "(" + planID + ", '" + date + "'),";
        });
    };
    if (nEntries < 1) {
        return;
    }
    var query = "insert into contributions (plan_id, date) values " + values.substring(0, values.length - 1) + ";";
    db.get().query(query, function (err, rows) {
        if (err) return console.log("ERROR::Failed to write to contributions table. Error was:" + err + " and query was:" + query);
    });
};

var getCutoffDate = function() {
    var startYear = '2018'; // Change this when the FY changes. Eg: if FY is 2018-19, then set this to 2018
    return startYear + "-04-01";
};

exports.getContributionReport = function (done) {
    var cutoffDate = getCutoffDate();
    db.get().query("SELECT * from contributionReport where date >= '" + cutoffDate + "'", function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.getPreviousBalance = function (done) {
    var cutoffDate = getCutoffDate();
    db.get().query("SELECT p.id as memberID, IFNULL(sum(c.plannedAmount), 0) as contributed, p.amount * TIMESTAMPDIFF(MONTH, p.activation_date, '" + cutoffDate + "') as planned from contributionReport c right outer join contribution_plan p on c.id = p.member_id where (c.date is null or (c.date < '" + cutoffDate + "' and c.date >= p.activation_date)) and '" + cutoffDate + "' > p.activation_date and (p.deactivation_date IS NULL or '" + cutoffDate + "' < deactivation_date) group by memberID", function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};
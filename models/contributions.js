var db = require('../db.js');

exports.getForPlanID = function (planID, done) {
    db.get().query("SELECT id, DATE_FORMAT(date, '%Y-%m-%d') as contribution_date FROM contributions where plan_id=" + planID + " order by date DESC limit 1", function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

exports.updateContributions = function (contributionEntries) {
    var values = '';
    for (var planID in contributionEntries) {
        var contributionDates = contributionEntries[planID];
        contributionDates.forEach(function (date) {
            values += "(" + planID + ", '" + date + "'),";
        });
    };
    var query = "insert into contributions (plan_id, date) values " + values.substring(0, values.length - 1) + ";";
    db.get().query(query, function (err, rows) {
        if (err) return console.log("ERROR::Failed to write to contributions table. Error was:" + err + " and query was:" + query);
    });
};

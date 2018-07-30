var db = require('../db.js');

exports.getForPlanID = function (planID, done) {
    db.get().query("SELECT id, DATE_FORMAT(date, '%Y-%m-%d') as contribution_date FROM contributions where plan_id=" + planID + " order by date DESC limit 1", function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    });
};

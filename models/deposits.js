var db = require('../db.js');

exports.getUnprocessed = function (done) {
    db.get().query("SELECT id, member_id, amount, DATE_FORMAT(date, '%Y-%m-%d') as deposit_date, processed_amount FROM deposits where type = 'REG' and (amount - processed_amount) > 0.0001 and member_id is not NULL and member_id != 0", function (err, rows) {
        if (err) return done(err);
        done(null, rows)
    });
};

exports.getPlanForMember = function (memberID, done) {
    db.get().query("SELECT id, (amount / frequency) as monthlyContribution FROM contribution_plan where (deactivation_date is NULL or activation_date > deactivation_date) and member_id=" + memberID, function (err, rows) {
        if (err) return done(err);
        done(null, rows)
    });
};
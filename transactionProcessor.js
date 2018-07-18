var db = require('./db');
var deposits = require('./models/deposits');

db.connect(null, function(err) {
    if (err) {
        console.log('ERROR::Unable to connect to MySQL.');
        process.exit(1);
    } else {
        console.log('DEBUG::Connected to MySQL.');
    }
});

var depositQueryDone = false;
var planQueryDone = false;

function compareDeposits(a, b) {
    var aDate = new Date(a.deposit_date);
    var bDate = new Date(b.deposit_date);

    if (aDate < bDate) {
        return -1;
    }

    if (aDate > bDate) {
        return 1;
    }

    return 0;
}

var memberDepositInfo = new Map();
deposits.getUnprocessed(function(err, rows) {
    if (err) {
        console.log("ERROR::" + err);
        process.exit(1);
    }

    for (var i = 0; i < rows.length; i++) {
        var entry = rows[i];
        var memDeposits = memberDepositInfo.get(entry.member_id);
        if (memDeposits) {
            memDeposits.push(entry);
        } else {
            memDeposits = [entry];
            memberDepositInfo.set(entry.member_id, memDeposits);
        }
    }

    //var contributedIDs = memberDepositInfo.keys();
    var contributionPlans = new Map();
    console.log("vijay1");
    memberDepositInfo.forEach(function (deposit, memberID) {
        deposits.getPlanForMember(memberID, function (err, rows) {
            if (err) {
                console.log("ERROR::" + err);
                process.exit(1);
            }

            if (rows.length != 1) {
                console.log("ERROR::There should be exactly 1 active ontribution plan for a member. Found:" + rows.length);
            }

            var memberDeposits = memberDepositInfo.get(memberID);
            memberDeposits.sort(compareDeposits);

            for (var i = 0; i < memberDeposits.length; i++) {

            }
        });
    });
    console.log("vijay3");
});


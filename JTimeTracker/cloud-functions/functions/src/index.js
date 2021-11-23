const generateBackup = require('./backup.js');
const produceReport = require('./produceReport.js');
const moment = require('moment');
const generateReportPDF = require('./generateReportPDF.js');

const functions = require('firebase-functions');
const admin = require('firebase-admin')


admin.initializeApp();

exports.automatedBackups = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(generateBackup);

exports.weeklyReport = functions.pubsub
  .schedule('00 22 * * Sun').timeZone('America/Toronto')
  .onRun(async () => {
    const dataSnap = await admin.firestore().collection('users').listDocuments();
    await Promise.all(dataSnap.map(o => produceReport({
      uid: o.id,
      reportType: 'Weekly',
      days: 6,
      startingDate: moment().tz('America/Toronto').subtract(1, 'day').startOf('week').add(1, 'day').format('YYYY-MM-DD')
    })));

  });

exports.monthlyReport = functions.pubsub
  .schedule('10 0 1 * *')
  .onRun(async () => {
    const startOfMonth = moment().subtract(3, 'days').startOf('month').format('YYYY-MM-DD hh:mm');
    const endOfMonth = moment().subtract(3, 'days').endOf('month').format('YYYY-MM-DD hh:mm');

    const dataSnap = await admin.firestore().collection('users').listDocuments();
    await Promise.all(dataSnap.map(o => produceReport({
      uid: o.id,
      reportType: 'Monthly',
      dateRange: [startOfMonth, endOfMonth]
    })));
  });

exports.produceReport = functions.https.onCall((data, context) => {
  return produceReport({
    ...data,
    uid: context.auth.uid
  })
});

exports.generateReportPDF = functions.https.onCall((data, context) => generateReportPDF(data, context));

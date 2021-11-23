const moment = require('moment-timezone');
const admin = require('firebase-admin')
const Handlebars = require('handlebars');
const reportTemplateHTML = require('./templates/report.js');
const sendReportMail = require('./utils/sendMail.js')
const calculateTimeLogged = require('./utils/timeLogged.js');
const getMostOccurringTime = require('./utils/getMostOccurringTime.js');

// const zone = 'America/Toronto';
const format = 'YYYY-MM-DD';
const hourFormat = 'HH:mm';
const titleSplit = ' [';

async function produceReport({dateRange, days, startingDate, endDate, uid, reportType, hideMail}) {
  const user = await admin.firestore().collection('users').doc(uid).get();
  const data = user.data();
  const content = data.content;
  if (!content || !content.notebooks || (!dateRange && !days && !startingDate && !endDate)) {
    console.log('No user content found for report');
    return {message: 'No report to generate'};
  }

  const settings = data.settings;

  const useRange = dateRange && dateRange[0] && dateRange[1] && moment(dateRange[1], format).isValid() && moment(dateRange[0], format).isValid() && moment(dateRange[1], format).isAfter(moment(dateRange[0], format));
  const useDays = typeof days === 'number' && isFinite(days);
  const startDate = startingDate ? startingDate : moment().format('YYYY-MM-DD');

  const booksCalculated = [];
  let listOfWages = [];

  for (const bookId in content.notebooks) {
    const title = content.notebooks[bookId].title;
    const entries = content.notebooks[bookId].entries;
    if (!entries || entries.length === 0) {
      console.log('No entries in notebook: ' + title);
      return;
    }
    let bookData = {
      dateRange: '',
      amountWorked: 0,
      amountBilled: 0,
      averageStartTime: '',
      averageEndTime: '',
      amountEarned: 0,
      amountUp: '0',
      listedRate: 0,
      effectiveRate: '0',
      bookTitle: title,
      companyBreakdown: [],
      reportType: '',
    };

    const getWage = (title) => {
      const split = title.split(titleSplit);
      return split[1] && !isNaN(split[1].replace('[', '').replace(']', '')) ? +split[1].replace('[', '').replace(']', '') : (+settings.wage || 0);
    }

    const filteredEntries = entries.filter(o => {
      if (getWage(o.title) == '0') {
        return false;
      }
      if (useRange) {
        return moment(o.date, format).isSameOrAfter(dateRange[0], 'day') && moment(o.date, format).isSameOrBefore(dateRange[1], 'day');
      } else if (useDays) {
        return moment(o.date, format).diff(moment(startDate, format), 'days') <= days && moment(startDate, format).isSameOrBefore(o.date, 'day');
      } else if (endDate) {
        return moment(o.date, format).isSameOrAfter(endDate, 'day');
      } else {
        return false;
      }
    });
    let smallestDate = '';
    let largestDate = '';
    const arrayOfStartTimes = [];
    const arrayOfEndTimes = [];

    let wouldHaveEarned = 0;
    for (const entry of filteredEntries) {
      // date range
      if (smallestDate === '' || moment(entry.date, format).isBefore(smallestDate, 'day')) smallestDate = entry.date;
      if (largestDate === '' || moment(entry.date, format).isAfter(largestDate, 'day')) largestDate = entry.date;
      ///

      const endLoggedCalc = calculateTimeLogged(entry.endLogged, (settings.escaped || 'h'));
      const startLoggedCalc = calculateTimeLogged(entry.startLogged, (settings.escaped || 'h'));

      // amount billed and worked
      bookData.amountBilled += startLoggedCalc;
      bookData.amountWorked += endLoggedCalc;
      //////
      const effectiveWage = getWage(entry.title)
      listOfWages.push(effectiveWage);
      //amount earned and up
      wouldHaveEarned += (endLoggedCalc * +effectiveWage);
      bookData.amountEarned += (startLoggedCalc * +effectiveWage);
      ////

      // average start and end times
      if (entry.start) {
        const indexOfStartDate = arrayOfStartTimes.findIndex(o => o.date === entry.date);
        if (indexOfStartDate === -1) {
          arrayOfStartTimes.push({
            date: entry.date,
            time: entry.start,
          });
        } else {
          const time = arrayOfStartTimes[indexOfStartDate].time;
          if (moment(time, hourFormat).isAfter(moment(entry.start, hourFormat))) {
            arrayOfStartTimes[indexOfStartDate].time = entry.start;
          }
        }
      }
      if (entry.end) {
        const indexOfEndDate = arrayOfEndTimes.findIndex(o => o.date === entry.date);
        if (indexOfEndDate === -1) {
          arrayOfEndTimes.push({
            date: entry.date,
            time: entry.end,
          });
        } else {
          const time = arrayOfEndTimes[indexOfEndDate].time;
          if (moment(time, hourFormat).isAfter(moment(entry.end, hourFormat))) {
            arrayOfEndTimes[indexOfEndDate].time = entry.end;
          }
        }
      }

      //company Breakdown
      const companyListed = bookData.companyBreakdown.findIndex(o => o.name === entry.title);
      if (companyListed > -1) {
        bookData.companyBreakdown[companyListed].worked += endLoggedCalc;
        bookData.companyBreakdown[companyListed].logged += startLoggedCalc;
        bookData.companyBreakdown[companyListed].earned += (startLoggedCalc * +effectiveWage);
      } else {
        bookData.companyBreakdown.push({
          name: entry.title,
          worked: endLoggedCalc,
          logged: startLoggedCalc,
          earned: (startLoggedCalc * +effectiveWage),
        });
      }
      ////
    }

    bookData.averageStartTime = getMostOccurringTime(arrayOfStartTimes, hourFormat) || 'Undetermined';
    bookData.averageEndTime = getMostOccurringTime(arrayOfEndTimes, hourFormat) || 'Undetermined';

    let sum = 0;
    for (let i = 0; i < listOfWages.length; i++) {
      sum += parseInt(listOfWages[i], 10);
    }

    bookData.listedRate = sum / listOfWages.length;
    const diffEarned = bookData.amountEarned - wouldHaveEarned;
    bookData.amountUp = (diffEarned >= 0 ? '+' : '') + diffEarned.toString();
    bookData.effectiveRate = (+bookData.amountEarned / +bookData.amountWorked).toFixed(2);
    if (bookData.effectiveRate === 'NaN') {
      bookData.effectiveRate = settings.wage;
    }

    const altFormat = 'MMM DD YYYY';
    let startDateRange = moment(smallestDate, format).format(altFormat);
    let endDateRange = moment(largestDate, format).format(altFormat);
    if (endDate) {
      endDateRange = moment(dateRange[1], format).format(altFormat);
    }
    if (useRange) {
      startDateRange = moment(dateRange[0], format).format(altFormat);
      endDateRange = moment(dateRange[1], format).format(altFormat);
    }


    if (startingDate && moment(startDate, format).isValid()) {
      startDateRange = moment(startDate, format).format(altFormat);
    }
    if (useDays) {
      endDateRange = moment(startDateRange, altFormat).add(days - 1, "days").format(altFormat);
    }

    bookData.dateRange = startDateRange + ' - ' + endDateRange;

    bookData.amountBilled = +bookData.amountBilled.toFixed(2);
    bookData.amountWorked = +bookData.amountWorked.toFixed(2);

    booksCalculated.push(bookData);
  }

  if (!hideMail) {
    for (const b of booksCalculated) {
      try {
        b.reportType = reportType;
        await sendReportMail(data.email, `Your ${reportType} report is here!`, b)
      } catch (e) {
        console.log('Failed to send email');
        console.log(JSON.stringify(e));
      }
    }
  }

  const template = Handlebars.compile(reportTemplateHTML);
  const templateResult = template(booksCalculated[0]);
  return {message: 'Report issued!', data: booksCalculated, template: templateResult}
}


module.exports = produceReport;

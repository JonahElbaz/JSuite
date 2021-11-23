const moment = require('moment');

function getMostOccurringTime(array, hourFormat) {
  const mapping = {};
  let mostOccurring = '';
  array.forEach(entry => {
    mapping[entry.time] = mapping[entry.time] ? mapping[entry.time] + 1 : 1;
  });
  for (const entry in mapping) {
    if (mostOccurring === '') {
      mostOccurring = entry;
    } else {
      if (mapping[entry] > mostOccurring[entry]) {
        mostOccurring = entry;
      }
    }
  }
  let occurrences = [mostOccurring];
  for (const entry in mapping) {
    if (mapping[entry] === mapping[mostOccurring] && entry !== mostOccurring) {
      occurrences.push(entry);
    }
  }

  if (occurrences.length > 1) {
    occurrences = occurrences.map(o => moment(moment(o, hourFormat).format()).unix());
    const sum = [...occurrences].reduce((total, num) => total + num);
    const newUnix = +sum / occurrences.length;
    return moment.unix(newUnix).format('HH:mm');
  } else {
    return occurrences[0];
  }
}

module.exports = getMostOccurringTime;

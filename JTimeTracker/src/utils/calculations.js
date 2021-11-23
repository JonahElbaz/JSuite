class Calculations {

  constructor(settings) {
    this.settings = settings;
  }

  calculateEntryEarnings(entry) {
    let amount = 0;
    const duration = this.calculateTotalHours(entry, 'startLogged');
    const extractRate = this.extractRate(entry.title)
    const wage = +extractRate || this.settings.wage || 0;
    if (duration && typeof duration === 'number') {
      amount = duration * wage;
    }
    return amount
  }

  calculateTotalHours(entry, prop) {
    return +(entry[prop].replace(/h/g, ''));
  }

  extractRate(title) {
    return +(title.substr(
      title.indexOf('[') + 1,
      title.indexOf(']') - title.indexOf('[') - 1,
    ))
  }

  calculateWorkingDayStats(entries) {
    let totalEarned = 0;
    let totalWorked = 0;
    let totalLogged = 0;

    for (const entry of entries.filter(o => this.extractRate(o.title) != '0')) {
      totalEarned += +this.calculateEntryEarnings(entry)
      totalLogged += +this.calculateTotalHours(entry, 'startLogged')
      totalWorked += +this.calculateTotalHours(entry, 'endLogged')
    }

    return {
      totalEarned,
      totalWorked,
      totalLogged
    }
  }
}

export default Calculations

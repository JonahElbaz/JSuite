function calculateTimeLogged(hoursString, escaped) {
  let enteredValue = hoursString || "";
  const regs = escaped.split(',');
  regs.forEach(reg => {
    const pattern = new RegExp(reg, 'g');
    enteredValue = enteredValue.replace(pattern, '');
  });
  if (isNaN(+enteredValue)) {
    return 0;
  }
  return +enteredValue;
}

module.exports = calculateTimeLogged;

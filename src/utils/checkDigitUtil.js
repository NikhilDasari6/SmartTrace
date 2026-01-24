exports.generateCheckDigit = (number) => {
  let sum = 0;
  let alternate = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let n = parseInt(number[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return (10 - (sum % 10)) % 10;
};

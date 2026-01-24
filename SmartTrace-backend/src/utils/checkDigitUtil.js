exports.calculateCheckDigit = (payload) => {
  const digits = payload.replace(/\D/g, "").split("").reverse();
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    let n = parseInt(digits[i], 10);
    if (i % 2 === 0) n *= 3;
    sum += n;
  }
  return (10 - (sum % 10)) % 10;
};


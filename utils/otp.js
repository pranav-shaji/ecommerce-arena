const otpGenerator = () => {
  let x = "";
  for (i = 1; i <= 4; i++) {
    let n = Math.floor(Math.random() * 10);
    x = x + n;
  }
  return x;
};

module.exports = otpGenerator;

export default {
  //Truncates a number to eight decimal places
  truncateToEightDecimals(nombre) {
    return Math.trunc(nombre * 100000000) / 100000000;
  },

  // Truncates a number to two decimal places
  truncateToTwoDecimals(nombre) {
    return Math.trunc(nombre * 100) / 100;
  },
};

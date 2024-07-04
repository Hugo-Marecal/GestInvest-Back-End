export default (date) => {
  // Compare user date with current date
  const dateInput = new Date(date);
  const todayDate = new Date();
  return dateInput > todayDate;
};

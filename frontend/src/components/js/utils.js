const parseMonth = (number) => {
  switch (number) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    default:
      return "December";
  }
};

export const parseTime = (datetime) => {
  const date = new Date(Date.parse(datetime));
  const string = `${date.getDate()} ${parseMonth(
    date.getMonth()
  )} ${date.getFullYear()}`;
  return string;
};

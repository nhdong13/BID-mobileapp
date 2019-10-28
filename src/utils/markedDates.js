import colors from 'assets/Color';

export const markDates = (requests) => {
  let markedDates = [];
  requests.forEach((request, index) => {
    if (request.sittingDate !== undefined && request.sittingDate !== null) {
      const markedDateFormat = {
        date: request.sittingDate,
        dots: [
          {
            key: index,
            color: colors.blueAqua,
            selectedDotColor: colors.lightGreen,
          },
        ],
      };
      markedDates.push(markedDateFormat);
    }
  });

  console.log(markedDates);
  return markedDates;
};

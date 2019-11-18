import colors from 'assets/Color';

export const markDates = (requests) => {
  const markedDates = [];
  requests.forEach((request, index) => {
    if (
      request.sittingDate !== undefined &&
      request.sittingDate !== null &&
      (request.status != 'DONE' && request.status != 'CANCELED')
    ) {
      const markedDateFormat = {
        date: request.sittingDate,
        dots: [
          {
            key: index,
            color: colors.dot,
            selectedDotColor: colors.white,
          },
        ],
      };
      markedDates.push(markedDateFormat);
    }
  });

  return markedDates;
};

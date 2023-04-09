import React from 'react';

import { FormattedDate } from 'react-intl';

// TODO: component or func ???
export const getDateRangeText = (range: [Date | null, Date | null], formatMessage: any) => {
  if (range[0] === null && range[1] === null) {
    return formatMessage({ id: 'co-all-time' });
  }
  if (range[0] !== null && range[1] === null) {
    return formatMessage(
      { id: 'co-for-month' },
      { month: <FormattedDate month="long" year="2-digit" value={range[0]} /> }
    );
  }
  if (range[0] !== null && range[1] !== null) {
    return formatMessage(
      { id: 'co-for-months' },
      {
        start: <FormattedDate month="long" year="2-digit" value={range[0]} />,
        end: <FormattedDate month="long" year="2-digit" value={range[1]} />
      }
    );
  }

  return null;
};

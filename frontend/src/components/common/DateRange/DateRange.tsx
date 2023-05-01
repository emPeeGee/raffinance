import React from 'react';

import { FormattedDate, useIntl } from 'react-intl';

const labelMap = {
  transactions: {
    all: 'co-txn-time',
    month: 'co-txn-month',
    months: 'co-txn-months'
  },
  analytics: {
    all: 'co-dsh-time',
    month: 'co-dsh-month',
    months: 'co-dsh-months'
  }
};
interface Props {
  range: [Date | null, Date | null];
  variant: 'transactions' | 'analytics';
}
export function DateRange({ range, variant }: Props) {
  const { formatMessage } = useIntl();

  if (range[0] === null && range[1] === null) {
    return <>{formatMessage({ id: labelMap[variant].all })}</>;
  }
  if (range[0] !== null && range[1] === null) {
    return (
      <>
        {formatMessage(
          { id: labelMap[variant].month },
          {
            month: <FormattedDate month="long" year="numeric" value={range[0]} />
          }
        )}
      </>
    );
  }
  if (range[0] !== null && range[1] !== null) {
    return (
      <>
        {formatMessage(
          { id: labelMap[variant].months },
          {
            start: <FormattedDate month="long" year="numeric" value={range[0]} />,
            end: <FormattedDate month="long" year="numeric" value={range[1]} />
          }
        )}
      </>
    );
  }

  return null;
}

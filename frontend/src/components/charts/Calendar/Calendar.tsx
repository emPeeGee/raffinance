import React from 'react';

import { Paper, Title, Box } from '@mantine/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ResponsiveCalendar, CalendarTooltipProps } from '@nivo/calendar';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';

import { useChartTheme } from 'hooks';
import { DayValueModel } from 'store';
import { capitalizeFirst } from 'utils';

function CustomTooltip({ value, day, color }: CalendarTooltipProps) {
  const { formatMessage } = useIntl();
  if (value === undefined) return null;

  return (
    <span style={{ color, backgroundColor: 'black', padding: '10px' }}>
      {formatMessage({ id: 'txn-count' }, { count: value, date: day })}
    </span>
  );
}

// /* TODO: year dynamic year */
interface Props {
  transactionsCount: DayValueModel[];
  height?: number;
}

export function Calendar({ transactionsCount, height = 250 }: Props) {
  const months = dayjs.localeData().months(); // Get an array of localized month names
  const { chartTheme, colors } = useChartTheme();

  return (
    <Box h={height} w="100%">
      <ResponsiveCalendar
        data={transactionsCount}
        from="2023-01-01"
        to="2023-12-31"
        emptyColor={colors.emptyDays}
        tooltip={CustomTooltip}
        onClick={(day) => {
          // TODO
          console.log(day);
        }}
        theme={chartTheme}
        monthLegend={(year, month) => capitalizeFirst(months[month])}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            symbolSize: 18,
            symbolShape: 'circle'
          }
        ]}
      />
    </Box>
  );
}

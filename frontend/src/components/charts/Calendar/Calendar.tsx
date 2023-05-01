import React from 'react';

import { Paper, Title, Box, useMantineTheme } from '@mantine/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ResponsiveCalendar, CalendarTooltipProps, Datum } from '@nivo/calendar';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';

import { useChartTheme } from 'hooks';
import { DayValueModel } from 'store';
import { capitalizeFirst } from 'utils';

function CustomTooltip({ value, day, color }: CalendarTooltipProps) {
  const { formatMessage, formatDate } = useIntl();
  const { colors } = useChartTheme();
  if (value === undefined) return null;

  return (
    <span style={{ backgroundColor: colors.background, padding: '10px' }}>
      {formatMessage({ id: 'txn-count' }, { count: <b>{value}</b>, date: formatDate(day) })}
    </span>
  );
}

// /* TODO: year dynamic year */
interface Props {
  transactionsCount: DayValueModel[];
  height?: number;
  onDayClick: (day: Datum | Omit<Datum, 'value' | 'data'>) => void;
}

export function Calendar({ transactionsCount, onDayClick, height = 250 }: Props) {
  const months = dayjs.localeData().months(); // Get an array of localized month names
  const { chartTheme, colors } = useChartTheme();

  return (
    <Box h={height} w="100%">
      <ResponsiveCalendar
        data={transactionsCount}
        from="2023-01-01"
        to="2023-12-31"
        colors={['#a1cfff', '#468df3', '#a053f0', '#9629f0', '#8428d8']}
        emptyColor={colors.emptyDays}
        tooltip={CustomTooltip}
        onClick={onDayClick}
        theme={chartTheme}
        dayBorderWidth={1}
        dayBorderColor={colors.borderColor}
        monthBorderWidth={1}
        monthBorderColor={colors.borderColor}
        margin={{ left: 8, right: 0 }}
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

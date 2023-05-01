import React from 'react';

import { Box, Card, Title, useMantineTheme } from '@mantine/core';
import { PointTooltipProps, ResponsiveLine, Serie } from '@nivo/line';

import { useChartTheme } from 'hooks';

interface Props {
  title: string;
  height: number;
  colors?: string[];
  enableArea?: boolean;
  areaOpacity?: number;
  data: Serie[];
}

function Areas({ series, areaGenerator, xScale, yScale }: any) {
  return series.map(({ id, data, color, disableArea }: any) => (
    <path
      key={id}
      d={areaGenerator(
        data.map((d: any) => ({
          x: xScale(d.data.x),
          y: yScale(d.data.y)
        }))
      )}
      fill={disableArea ? 'none' : color}
      fillOpacity={0.25}
    />
  ));
}

function Tooltip({ p }: { p: PointTooltipProps }) {
  const theme = useMantineTheme();
  const isDarkMode = theme.colorScheme === 'dark';
  const background = isDarkMode ? theme.colors.gray[9] : theme.colors.gray[1];
  const border = isDarkMode ? theme.black : theme.colors.gray[5];

  return (
    <div
      style={{
        background,
        padding: '9px 12px',
        border: `1px solid ${border}`
      }}>
      <div>
        <strong>{p.point.serieId}</strong> {p.point.data.xFormatted}
      </div>
      <div
        key={p.point.id}
        style={{
          color: p.point.serieColor,
          padding: '3px 0'
        }}>
        {p.point.data.yFormatted} CUR
      </div>
    </div>
  );
}

export function LineDateChart({
  title,
  height,
  data,
  enableArea = false,
  areaOpacity = 0.07,
  colors = ['rgb(97, 205, 187)', 'rgb(244, 117, 96)']
}: Props) {
  const { chartTheme } = useChartTheme();

  return (
    <Box my="sm" w="100%">
      <Card withBorder radius="lg" p="md">
        <Title order={2} mb="sm">
          {title}
        </Title>
        <Box h={height}>
          <ResponsiveLine
            colors={colors}
            layers={[
              Areas,
              'grid',
              'markers',
              'axes',
              'crosshair',
              'lines',
              'points',
              'slices',
              'mesh',
              'legends'
            ]}
            theme={chartTheme}
            data={data}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              useUTC: false,
              precision: 'day'
            }}
            curve="monotoneX"
            xFormat="time:%Y-%m-%d"
            yScale={{
              type: 'linear',
              stacked: false,
              min: 'auto',
              max: 'auto',
              clamp: true
            }}
            axisLeft={{
              legendOffset: 12,
              tickSize: 0
            }}
            axisBottom={{
              format: '%b %d',
              tickSize: 0,
              tickPadding: 12
            }}
            enablePointLabel
            pointSize={8}
            pointBorderWidth={1}
            pointBorderColor={{
              from: 'color',
              modifiers: [['darker', 0.3]]
            }}
            pointLabelYOffset={-10}
            margin={{ left: 50, right: 16, top: 20, bottom: 30 }}
            enableArea={enableArea}
            areaOpacity={areaOpacity}
            enableSlices={false}
            enableGridX={false}
            useMesh
            // eslint-disable-next-line react/no-unstable-nested-components
            tooltip={(s) => <Tooltip p={s} />}
            crosshairType="cross"
          />
        </Box>
      </Card>
    </Box>
  );
}

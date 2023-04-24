import React from 'react';

import { Box, Paper, Title } from '@mantine/core';
import { ResponsiveLine, Serie } from '@nivo/line';

interface Props {
  title: string;
  height: number;
  colors?: string[];
  enableArea?: boolean;
  areaOpacity?: number;
  data: Serie[];
}

export function LineDateChart({
  title,
  height,
  data,
  enableArea = false,
  areaOpacity = 0.07,
  colors = ['rgb(97, 205, 187)', 'rgb(244, 117, 96)']
}: Props) {
  return (
    <Box my="sm" w="100%">
      <Paper withBorder radius="lg" p="md">
        <Title order={2} mb="sm">
          {title}
        </Title>
        <Box h={height}>
          <ResponsiveLine
            colors={colors}
            theme={{
              labels: {
                text: {
                  fontSize: 16
                }
              }
            }}
            data={data}
            xScale={{
              type: 'time',
              format: '%Y-%m-%d',
              useUTC: false,
              precision: 'day'
              // nice: false
            }}
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
            tooltip={(s) => (
              <div
                style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc'
                }}>
                <div>
                  <strong>{s.point.serieId}</strong> {s.point.data.xFormatted}
                </div>
                <div
                  key={s.point.id}
                  style={{
                    color: s.point.serieColor,
                    padding: '3px 0'
                  }}>
                  {s.point.data.yFormatted} CUR
                </div>
              </div>
            )}
            crosshairType="cross"
          />
        </Box>
      </Paper>
    </Box>
  );
}

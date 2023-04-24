import React from 'react';

import { Box, Paper, Title } from '@mantine/core';
import { ResponsiveLine } from '@nivo/line';

import { LabelValueModel } from 'store';

export function LineNumberChart({
  title,
  height,
  data
}: {
  title?: string;
  height: string | number;
  data: LabelValueModel[];
}) {
  return (
    <Box my="sm" w="100%">
      <Paper withBorder radius="lg" p="md">
        <Title order={2} mb="sm">
          {title}
        </Title>
        <Box h={height}>
          <ResponsiveLine
            // {...commonProperties}

            colors={['rgb(97, 205, 187)', 'rgb(244, 117, 96)']}
            // data={data.map((d) => ({ ...d, id: d.label }))}
            theme={{
              labels: {
                text: {
                  fontSize: 16
                }
              }
            }}
            data={[
              {
                id: 'positive :)',
                data: [
                  { x: 0, y: 0.7 },
                  { x: 1, y: 0.9 },
                  { x: 2, y: 0.8 },
                  { x: 3, y: 0.6 },
                  { x: 4, y: 0.3 },
                  { x: 5, y: 0 },
                  { x: 6, y: null },
                  { x: 7, y: null },
                  { x: 8, y: null },
                  { x: 9, y: null },
                  { x: 10, y: null },
                  { x: 11, y: 0 },
                  { x: 12, y: 0.4 },
                  { x: 13, y: 0.6 },
                  { x: 14, y: 0.5 },
                  { x: 15, y: 0.3 },
                  { x: 16, y: 0.4 },
                  { x: 17, y: 0 }
                ]
              },
              {
                id: 'negative :(',
                data: [
                  { x: 5, y: 0 },
                  { x: 6, y: -0.3 },
                  { x: 7, y: -0.5 },
                  { x: 8, y: -0.9 },
                  { x: 9, y: -0.2 },
                  { x: 10, y: -0.4 },
                  { x: 11, y: 0 },
                  { x: 12, y: null },
                  { x: 13, y: null },
                  { x: 14, y: null },
                  { x: 15, y: null },
                  { x: 16, y: null },
                  { x: 17, y: 0 },
                  { x: 18, y: -0.4 },
                  { x: 19, y: -0.2 },
                  { x: 20, y: -0.1 },
                  { x: 21, y: -0.6 }
                ]
              }
            ]}
            // curve={select('curve', curveOptions, 'monotoneX')}
            // pointSymbol={CustomSymbol}
            enablePointLabel
            pointSize={8}
            pointBorderWidth={1}
            pointBorderColor={{
              from: 'color',
              modifiers: [['darker', 0.3]]
            }}
            pointLabelYOffset={-20}
            enableGridX={false}
            xScale={{
              type: 'linear'
            }}
            margin={{ left: 50, top: 20, bottom: 20 }}
            yScale={{
              type: 'linear',
              stacked: false,
              min: 'auto',
              max: 'auto',
              clamp: true
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'transportation',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'count',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            enableArea
            areaOpacity={0.07}
            enableSlices={false}
            useMesh
            crosshairType="cross"
          />
        </Box>
      </Paper>
    </Box>
  );
}

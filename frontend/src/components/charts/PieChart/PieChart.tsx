import React from 'react';

import { Box, Paper, Title } from '@mantine/core';
import { ResponsivePie } from '@nivo/pie';

import { LabelValueModel } from 'store';

function CenteredMetric({ dataWithArc, centerX, centerY, ...props }: any) {
  let total = 0;
  dataWithArc.forEach((datum: any) => {
    total += datum.value;
  });

  console.log(dataWithArc, centerX, centerY, props);

  return (
    <>
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        dominantBaseline="central"
        fill="black"
        style={{
          fontSize: '18px'
        }}>
        All categories
      </text>

      <text
        x={centerX}
        y={centerY + 14}
        textAnchor="middle"
        dominantBaseline="central"
        fill="black"
        style={{
          fontSize: '18px'
        }}>
        {total}
      </text>
    </>
  );
}

export function PieChart({
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
        <Title order={2}>{title}</Title>
        <Box h={height}>
          <ResponsivePie
            data={data.map((d) => ({ ...d, id: d.label }))}
            colors={{ scheme: 'nivo' }}
            theme={{
              labels: {
                text: {
                  fontSize: 16
                }
              }
            }}
            margin={{ top: 40, right: 20, bottom: 40, left: 20 }}
            innerRadius={0.5}
            padAngle={1.5}
            cornerRadius={8}
            activeOuterRadiusOffset={8}
            activeInnerRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={4}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]]
            }}
            layers={['arcs', 'arcLabels', 'arcLinkLabels', CenteredMetric]}
            // legends={[
            //   {
            //     anchor: 'bottom',
            //     direction: 'row',
            //     justify: false,
            //     translateX: 0,
            //     translateY: 56,
            //     itemsSpacing: 0,
            //     itemWidth: 60,
            //     itemHeight: 18,
            //     itemTextColor: '#999',
            //     itemDirection: 'left-to-right',
            //     itemOpacity: 1,
            //     symbolSize: 18,
            //     symbolShape: 'circle',
            //     effects: [
            //       {
            //         on: 'hover',
            //         style: {
            //           itemTextColor: '#000'
            //         }
            //       }
            //     ]
            //   }
            // ]}
          />
        </Box>
      </Paper>
    </Box>
  );
}

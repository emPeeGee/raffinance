import { useMantineTheme } from '@mantine/core';
import { Theme } from '@nivo/core';

interface ChartTheme {
  chartTheme: Theme;
  colors: { textColor: string; background: string };
}

export function useChartTheme(): ChartTheme {
  const theme = useMantineTheme();
  const isDarkMode = theme.colorScheme === 'dark';

  const textColor = isDarkMode ? theme.colors.gray[1] : theme.colors.gray[7];
  const background = isDarkMode ? theme.colors.gray[7] : theme.colors.gray[1];

  const colors = {
    textColor,
    background
  };

  const chartTheme: Theme = {
    background: isDarkMode ? theme.colors.dark[8] : theme.white,
    textColor,
    grid: {
      line: {
        stroke: background
      }
    },
    axis: {
      domain: {
        line: {
          stroke: textColor
        }
      },
      ticks: {
        line: {
          stroke: textColor
        }
      }
    },
    crosshair: {
      line: {
        stroke: textColor
      }
    },
    tooltip: {
      container: {
        background
      }
    },
    annotations: {
      link: {
        stroke: textColor,
        outlineColor: textColor
      },
      text: {
        stroke: textColor,
        outlineColor: textColor
      },
      outline: {
        stroke: textColor,
        outlineColor: textColor
      },
      symbol: {
        stroke: textColor,
        outlineColor: textColor
      }
    },
    labels: {
      text: {
        fill: textColor,
        color: textColor,
        stroke: textColor,
        outlineColor: textColor
      }
    }
    // colors: isDarkMode
    //   ? [theme.colors.blue[1], theme.colors.red[1], theme.colors.yellow[1], theme.colors.green[1]]
    //   : [theme.colors.blue[7], theme.colors.red[7], theme.colors.yellow[7], theme.colors.green[7]]
  };

  return { chartTheme, colors };
}

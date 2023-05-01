import { useMantineTheme } from '@mantine/core';
import { Theme } from '@nivo/core';

interface ChartTheme {
  chartTheme: Theme;
  colors: { textColor: string; background: string; emptyDays: string; borderColor: string };
}

export function useChartTheme(): ChartTheme {
  const theme = useMantineTheme();
  const isDarkMode = theme.colorScheme === 'dark';

  const textColor = isDarkMode ? theme.colors.gray[1] : theme.colors.gray[7];
  const background = isDarkMode ? theme.colors.gray[7] : theme.colors.gray[1];
  const emptyDays = isDarkMode ? theme.colors.dark[6] : theme.white;
  const borderColor = isDarkMode ? theme.colors.dark[3] : theme.colors.gray[5];

  const colors = {
    textColor,
    background,
    emptyDays,
    borderColor
  };

  const defaultObj = {
    // stroke: textColor,
    color: textColor,
    outlineColor: textColor,
    fill: textColor
  };

  const chartTheme: Theme = {
    background: isDarkMode ? theme.colors.dark[6] : theme.white,
    textColor,
    grid: {
      line: {
        stroke: background
      }
    },

    axis: {
      domain: {
        line: {
          ...defaultObj
        }
      },
      ticks: {
        line: {
          ...defaultObj
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
    legends: {
      title: {
        text: {
          ...defaultObj
        }
      },
      ticks: {
        text: {
          ...defaultObj
        }
      },
      text: {
        ...defaultObj
      },
      hidden: {
        text: {
          ...defaultObj
        }
      }
    },
    annotations: {
      link: {
        ...defaultObj
      },
      text: {
        ...defaultObj
      },
      outline: {
        ...defaultObj
      },
      symbol: {
        ...defaultObj
      }
    },
    labels: {
      text: {
        color: textColor
      }
    }
    // colors: isDarkMode
    //   ? [theme.colors.blue[1], theme.colors.red[1], theme.colors.yellow[1], theme.colors.green[1]]
    //   : [theme.colors.blue[7], theme.colors.red[7], theme.colors.yellow[7], theme.colors.green[7]]
  };

  return { chartTheme, colors };
}

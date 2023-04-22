import React from 'react';

import { Container, SimpleGrid, Text, ThemeIcon, Title, createStyles, rem } from '@mantine/core';
import { IconBuildingFactory2, IconReportMoney, IconSchool, IconUsers } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: rem(80),
    paddingBottom: rem(50),
    marginBottom: rem(50)
  },

  item: {
    display: 'flex'
  },

  itemIcon: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.md
  },

  itemTitle: {
    marginBottom: `calc(${theme.spacing.xs} / 2)`
  },

  supTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 800,
    fontSize: theme.fontSizes.sm,
    color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    letterSpacing: rem(0.5)
  },

  title: {
    lineHeight: 1,
    textAlign: 'center',
    marginTop: theme.spacing.xl
  },

  description: {
    textAlign: 'center',
    marginTop: theme.spacing.xs
  },

  highlight: {
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    padding: rem(5),
    paddingTop: 0,
    borderRadius: theme.radius.sm,
    display: 'inline-block',
    color: theme.colorScheme === 'dark' ? theme.white : 'inherit'
  }
}));

const data = [
  {
    image: <IconSchool size="3rem" />,
    title: 'Young Professionals',
    description:
      'Young professionals who are just starting their careers and building their financial lives'
  },

  {
    image: <IconReportMoney size="3rem" />,
    title: 'Small Business Owners',
    description:
      'If they have multiple accounts or need to keep business and personal finances separate'
  },

  {
    image: <IconBuildingFactory2 size="3rem" />,
    title: 'Freelancers and Gig Workers',
    description:
      'May benefit from features for tracking income and expenses, managing taxes, and setting financial goals. '
  },

  {
    image: <IconUsers size="3rem" />,
    title: 'Couples and Families',
    description:
      'Tracking shared expenses, managing family budgets, or saving for a shared goal such as a family vacation or home renovation'
  }
];

export function UseCases() {
  const { classes } = useStyles();

  const items = data.map((item) => (
    <div className={classes.item} key={item.title}>
      <ThemeIcon variant="light" className={classes.itemIcon} size={60} radius="md">
        {item.image}
        {/* <Image src={IMAGES[item.image]} /> */}
      </ThemeIcon>

      <div>
        <Text fw={700} fz="lg" className={classes.itemTitle}>
          {item.title}
        </Text>
        <Text c="dimmed">{item.description}</Text>
      </div>
    </div>
  ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Use cases</Text>

      <Title className={classes.title} order={2}>
        Raffinance is <span className={classes.highlight}>not</span> just for financiers
      </Title>

      {/* <Container size={660} p={0}>
        <Text color="dimmed" className={classes.description}>
          Its lungs contain an organ that creates electricity. The crackling sound of electricity
          can be heard when it exhales. Azurill’s tail is large and bouncy. It is packed full of the
          nutrients this Pokémon needs to grow.
        </Text>
      </Container> */}

      <SimpleGrid
        cols={2}
        spacing={50}
        breakpoints={[{ maxWidth: 550, cols: 1, spacing: 40 }]}
        style={{ marginTop: 30 }}>
        {items}
      </SimpleGrid>
    </Container>
  );
}

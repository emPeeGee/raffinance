import React from 'react';

import {
  Container,
  Text,
  Group,
  Title,
  Flex,
  Table,
  createStyles,
  Avatar,
  rem,
  Paper
} from '@mantine/core';
import { IconAt, IconCalendarBolt, IconEdit, IconPhoneCall } from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';

import avatar from 'assets/logo.png';
import { useAuthStore } from 'store';

import { UserModel } from '../authentication.model';

const useStyles = createStyles((theme) => ({
  tableHeader: {
    '& th': {
      fontWeight: 'bold'
    }
  },
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

// TODO: Profile edit
// TODO: Include and location ???

export function Profile() {
  const { formatMessage } = useIntl();
  const { user } = useAuthStore();
  const { username, name, email, phone, createdAt, latestLogins, updatedAt } = user as UserModel;
  const { classes } = useStyles();

  const latestLoginsRows = latestLogins?.map((date, idx) => {
    const latestLogin = new Date(date);

    return (
      <tr key={date}>
        <td>{idx}</td>
        <td>
          <FormattedDate value={latestLogin} dateStyle="full" timeStyle="medium" />
        </td>
      </tr>
    );
  });

  return (
    <Container my="xl">
      <Title order={1} mb="lg">
        {formatMessage({ id: 'co-profile' })}
      </Title>
      <Flex direction="column">
        <Paper withBorder p="lg" mb="lg" radius="md">
          <Group noWrap>
            <Avatar src={avatar} size={94} radius="md" />
            <div>
              <Text fz={rem('1.5rem')} fw={500} className={classes.name}>
                {name}
              </Text>

              <Text fz={rem('1.25rem')} tt="uppercase" fw={700} c="dimmed">
                {username}
              </Text>

              <Group noWrap spacing={10} mt={3}>
                <IconAt stroke={1.5} size="1.5rem" className={classes.icon} />
                <Text fz={rem('1.25rem')} c="dimmed">
                  {email}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={5}>
                <IconPhoneCall stroke={1.5} size="1.5rem" className={classes.icon} />
                <Text fz={rem('1.25rem')} c="dimmed">
                  {phone}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={5}>
                <IconCalendarBolt stroke={1.5} size="1.5rem" className={classes.icon} />
                <Text fz={rem('1.25rem')}>{formatMessage({ id: 'co-cre-at' })}</Text>
                <Text fz={rem('1.25rem')} c="dimmed">
                  <FormattedDate value={createdAt} dateStyle="full" timeStyle="medium" />
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={5}>
                <IconEdit stroke={1.5} size="1.5rem" className={classes.icon} />
                <Text fz={rem('1.25rem')}>{formatMessage({ id: 'co-las-up' })}</Text>
                <Text fz={rem('1.25rem')} c="dimmed">
                  <FormattedDate value={updatedAt} dateStyle="full" timeStyle="medium" />
                </Text>
              </Group>
            </div>
          </Group>
        </Paper>

        <Flex direction="column" mb={rem('2rem')}>
          <Title order={2} py={rem('2rem')}>
            {formatMessage({ id: 'co-latest-log' })}
          </Title>
          <Table miw={700} striped withColumnBorders>
            <thead className={classes.tableHeader}>
              <tr>
                <th>#</th>
                <th>{formatMessage({ id: 'co-date' })}</th>
              </tr>
            </thead>
            <tbody>{latestLoginsRows}</tbody>
          </Table>
        </Flex>
      </Flex>
    </Container>
  );
}

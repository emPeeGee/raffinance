import React, { useContext } from 'react';
import {
  Code,
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
import { UserContext } from 'features/authentication/user.context';
import avatar from 'assets/logo.png';
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

export function Profile() {
  const userContext = useContext(UserContext);
  const { username, name, email, phone, createdAt, latestLogins, updatedAt } =
    userContext?.user as UserModel;
  const { classes } = useStyles();

  const createdDate = new Date(createdAt).toTimeString();
  const updatedDate = new Date(updatedAt).toTimeString();

  const latestLoginsRows = latestLogins.map((row, idx) => {
    const date = new Date(row).toTimeString();

    return (
      <tr key={row}>
        <td>{idx}</td>
        <td>{date}</td>
      </tr>
    );
  });

  return (
    <Container my={32}>
      <Title order={1} py={rem('2rem')}>
        Profile
      </Title>
      <Flex direction="column">
        <Paper withBorder p={rem('2rem')} mb={rem('2rem')} radius="md">
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
                <Text fz={rem('1.25rem')}>Created at: </Text>
                <Text fz={rem('1.25rem')} c="dimmed">
                  {createdDate}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={5}>
                <IconEdit stroke={1.5} size="1.5rem" className={classes.icon} />
                <Text fz={rem('1.25rem')}>Last update: </Text>
                <Text fz={rem('1.25rem')} c="dimmed">
                  {updatedDate}
                </Text>
              </Group>
            </div>
          </Group>
        </Paper>

        <Flex direction="column" mb={rem('2rem')}>
          <Title order={2} py={rem('2rem')}>
            Latest logins
          </Title>
          <Table miw={700}>
            <thead className={classes.tableHeader}>
              <tr>
                <th>#</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>{latestLoginsRows}</tbody>
          </Table>
        </Flex>
      </Flex>
    </Container>
  );
}

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
  Avatar
} from '@mantine/core';
import { IconAt, IconPhoneCall } from '@tabler/icons-react';
import { UserContext } from 'features/authentication/user.context';
import avatar from 'assets/logo.png';
import { UserModel } from '../authentication.model';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

export function Profile() {
  const userContext = useContext(UserContext);
  const { username, name, email, phone, createdAt, latestLogins, updatedAt } =
    userContext?.user as UserModel;
  const { classes } = useStyles();

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
      <Title order={1}>Profile</Title>
      <Flex direction="column">
        <Group noWrap>
          <Avatar src={avatar} size={94} radius="md" />
          <div>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              {username}
            </Text>

            <Text fz="lg" fw={500} className={classes.name}>
              {name}
            </Text>

            <Group noWrap spacing={10} mt={3}>
              <IconAt stroke={1.5} size="1rem" className={classes.icon} />
              <Text fz="xs" c="dimmed">
                {email}
              </Text>
            </Group>

            <Group noWrap spacing={10} mt={5}>
              <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
              <Text fz="xs" c="dimmed">
                {phone}
              </Text>
            </Group>
          </div>
        </Group>

        <Group>
          <Text>Your name: </Text>
          <Code color="violet" my="xs" style={{ fontSize: '20px' }}>
            {userContext?.user?.username}
          </Code>
        </Group>

        <Group>
          <Text>Your username: </Text>
          <Code color="primary" my="xs" style={{ fontSize: '20px' }}>
            {userContext?.user?.name}
          </Code>
        </Group>

        <Group>
          <Text>User created at: </Text>
          <Code color="yellow" my="xs" style={{ fontSize: '20px' }}>
            {createdAt}
          </Code>
        </Group>

        <Group>
          <Text>Last user update: </Text>
          <Code color="yellow" my="xs" style={{ fontSize: '20px' }}>
            {updatedAt}
          </Code>
        </Group>

        <Group>
          <Text>Your email: </Text>
          <Code color="primary" my="xs" style={{ fontSize: '20px' }}>
            {userContext?.user?.email}
          </Code>
        </Group>

        <Group>
          <Text>Your phone: </Text>
          <Code color="primary" my="xs" style={{ fontSize: '20px' }}>
            {phone}
          </Code>
        </Group>

        <Table miw={700}>
          <thead>
            <tr>
              <th>Number</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>{latestLogins}</tbody>
        </Table>
      </Flex>
    </Container>
  );
}

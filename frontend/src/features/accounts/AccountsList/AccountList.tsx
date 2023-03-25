import React from 'react';
import {
  Table,
  Text,
  Button,
  ColorSwatch,
  Group,
  Paper,
  createStyles,
  rem,
  SimpleGrid,
  UnstyledButton
} from '@mantine/core';
import { FormattedDate, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { IconRocket } from '@tabler/icons-react';

import { useAccountStore } from '../store';

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
    '&:hover': {
      filter: 'brightness(80%)'
    }
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1
  },

  diff: {
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center'
  },

  title: {
    fontWeight: 700,
    textTransform: 'uppercase'
  }
}));

type Props = {};

export function AccountsList(props: Props) {
  const { accounts, viewMode } = useAccountStore();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const gotoAccount = (id: number) => () => {
    navigate(`/accounts/${id}`, {
      replace: true
    });
  };

  return (
    <>
      {viewMode === 'table' && (
        <Table striped style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>{formatMessage({ id: 'ac-name' })}</th>
              <th>{formatMessage({ id: 'co-bal' })}</th>
              <th>{formatMessage({ id: 'co-cur' })}</th>
              <th>{formatMessage({ id: 'co-color' })}</th>
              <th>{formatMessage({ id: 'co-las-up' })}</th>
              <th>{formatMessage({ id: 'co-actions' })}</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(({ id, name, balance, currency, color, updatedAt }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{balance}</td>
                <td>{currency}</td>
                <td>
                  <Group>
                    <ColorSwatch key={color} color={color} />
                    {color}
                  </Group>
                </td>
                <td>
                  <FormattedDate value={updatedAt} dateStyle="full" timeStyle="medium" />
                </td>
                <td>
                  <Button
                    color="blue"
                    variant="outline"
                    onClick={gotoAccount(id)}
                    leftIcon={<IconRocket />}>
                    {formatMessage({ id: 'co-view' })}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {viewMode === 'card' && (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'xs', cols: 1 }
          ]}>
          {accounts.map(({ id, name, color, currency, balance }) => (
            <Paper withBorder p="md" radius="md" key={name} className={classes.root} bg={color}>
              <UnstyledButton onClick={gotoAccount(id)}>
                <Group position="apart">
                  <Text size="xs" color="dimmed" className={classes.title}>
                    {name}
                  </Text>
                  <Text>{currency}</Text>
                </Group>

                <Group align="flex-end" spacing="xs" mt={25}>
                  <Text className={classes.value}>{balance}</Text>
                  {/* <Text
                  color={stat.diff > 0 ? 'teal' : 'red'}
                  fz="sm"
                  fw={500}
                  className={classes.diff}>
                  <span>{stat.diff}%</span>
                  <DiffIcon size="1rem" stroke={1.5} />
                </Text> */}
                </Group>

                {/* // TODO: balance comparision */}
                <Text fz="xs" c="dimmed" mt={7}>
                  Compared to previous month
                </Text>
              </UnstyledButton>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </>
  );
}

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
import { IconArrowUpRight, IconRocket } from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { getContrastColor } from 'utils';

import { useAccountStore } from '../store';

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
    '&:hover': {
      filter: 'brightness(80%)'
    }
  },

  value: {
    fontSize: rem(28),
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
  },
  diffWrapper: {
    padding: '0.3rem',
    borderRadius: 10,
    backgroundColor:
      theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
  }
}));

type Props = {};

export function AccountsList(props: Props) {
  const { accounts, viewMode } = useAccountStore();
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const gotoAccount = (id: number) => () => {
    navigate(`/accounts/${id}`, {
      replace: true
    });
  };

  /* eslint-disable  no-constant-condition */
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
          {accounts.map(({ id, name, color, currency, balance }) => {
            const textColor = getContrastColor(color);

            return (
              <Paper withBorder p="md" radius="md" key={name} className={classes.root} bg={color}>
                <UnstyledButton onClick={gotoAccount(id)}>
                  <Group position="apart">
                    <Text size="xs" color={textColor} className={classes.title}>
                      {name}
                    </Text>
                    <Text color={textColor}>{currency}</Text>
                  </Group>

                  <Group align="flex-end" spacing="xs" mt={25}>
                    <Text className={classes.value} color={textColor}>
                      {balance}
                    </Text>

                    <div className={classes.diffWrapper}>
                      <Text
                        color={50 > 0 ? 'teal' : 'red'}
                        fz="sm"
                        fw={700}
                        className={classes.diff}>
                        <span>{50}%</span>
                        <IconArrowUpRight size="1rem" stroke={3.5} />
                      </Text>
                    </div>
                  </Group>
                  {/* // TODO: balance comparision */}
                  <Text fz="sm" my="0.5rem" c={textColor}>
                    Compared to previous month
                  </Text>

                  {/* // TODO: number of transactions */}
                  <Text fz="sm" my="0.5rem" c={textColor}>
                    20 transactions
                  </Text>
                </UnstyledButton>
              </Paper>
            );
          })}
        </SimpleGrid>
      )}
    </>
  );
}

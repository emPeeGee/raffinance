import React from 'react';

import {
  Button,
  ColorSwatch,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Table,
  Text,
  UnstyledButton,
  createStyles,
  rem
} from '@mantine/core';
import { IconArrowDownRight, IconArrowUpRight, IconArrowsDoubleNeSw } from '@tabler/icons-react';
import { FormattedDate, FormattedNumber, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Iconify } from 'components';
import { useSettingsStore } from 'store';
import { getContrastColor } from 'utils';

import { useAccountStore } from '../../../store/accounts.store';

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
  const { accounts } = useAccountStore();
  const { classes, theme } = useStyles();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { viewMode } = useSettingsStore();

  const gotoAccount = (id: number) => () => {
    navigate(`/accounts/${id}`);
  };

  const getRateColor = (rate?: number) => {
    if (rate === 0 || rate === undefined) {
      const color =
        theme.colorScheme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)';

      return (
        <Text color={color} fz="sm" fw={700} className={classes.diff}>
          <IconArrowsDoubleNeSw size="1rem" stroke={3.5} />
          <Space w="0.25rem" />
          <FormattedNumber value={rate ?? 0} minimumFractionDigits={2} maximumFractionDigits={2} />
        </Text>
      );
    }
    if (rate > 0) {
      return (
        <Text color="green" fz="sm" fw={700} className={classes.diff}>
          <IconArrowUpRight size="1rem" stroke={3.5} />
          <Space w="0.25rem" />
          <FormattedNumber value={rate ?? 0} minimumFractionDigits={2} maximumFractionDigits={2} />
        </Text>
      );
    }

    return (
      <Text color="red" fz="sm" fw={700} className={classes.diff}>
        <IconArrowDownRight size="1rem" stroke={3.5} />
        <Space w="0.25rem" />
        <FormattedNumber value={rate ?? 0} minimumFractionDigits={2} maximumFractionDigits={2} />
      </Text>
    );
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
            {accounts.map(({ id, name, balance, currency, icon, color, updatedAt }) => (
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
                    leftIcon={<Iconify icon={icon} />}>
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
          {accounts.map(
            ({ id, name, color, icon, currency, balance, transactionCount, rateWithPrevMonth }) => {
              const textColor = getContrastColor(color);

              return (
                <Paper withBorder p="md" radius="md" key={name} className={classes.root} bg={color}>
                  <UnstyledButton w="100%" onClick={gotoAccount(id)}>
                    <Group position="apart">
                      <Group align="center" spacing="0.25rem">
                        <Text size="xs" color={textColor} className={classes.title}>
                          {name}
                        </Text>
                        <Iconify icon={icon} color={textColor} size="1rem" />
                      </Group>
                      <Text color={textColor}>{currency}</Text>
                    </Group>

                    <Group align="flex-end" spacing="xs" mt={25}>
                      <Text className={classes.value} color={textColor}>
                        {balance}
                      </Text>

                      <div className={classes.diffWrapper}>{getRateColor(rateWithPrevMonth)}</div>
                    </Group>
                    <Text fz="sm" my="0.5rem" c={textColor}>
                      {formatMessage({ id: 'co-comp-prev-month' })}
                    </Text>

                    <Text fz="sm" my="0.5rem" c={textColor}>
                      {transactionCount} {formatMessage({ id: 'txn' }).toLocaleLowerCase()}
                    </Text>
                  </UnstyledButton>
                </Paper>
              );
            }
          )}
        </SimpleGrid>
      )}
    </>
  );
}

// TODO: enter in delete confirm to confirm

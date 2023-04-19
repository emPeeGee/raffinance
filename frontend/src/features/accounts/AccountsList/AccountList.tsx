import React from 'react';

import {
  Button,
  ColorSwatch,
  Group,
  Paper,
  SimpleGrid,
  Table,
  Text,
  UnstyledButton,
  createStyles,
  rem
} from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { FormattedDate, useIntl } from 'react-intl';
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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { viewMode } = useSettingsStore();

  const gotoAccount = (id: number) => () => {
    navigate(`/accounts/${id}`);
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
          {accounts.map(({ id, name, color, icon, currency, balance, transactionCount }) => {
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
                    {transactionCount} transactions
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

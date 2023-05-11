import React from 'react';

import { Anchor, Badge, Flex, Group, Table } from '@mantine/core';
import { IconArrowsExchange, IconCashBanknote, IconCashBanknoteOff } from '@tabler/icons-react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { NoData } from 'components';
import { getContrastColor } from 'utils';

import { TransactionModel, TransactionType } from '../transactions.model';

interface Props {
  transactions: TransactionModel[];
}

export function TransactionTable({ transactions }: Props) {
  if (transactions.length === 0) {
    return <NoData />;
  }

  return (
    <Table highlightOnHover striped>
      <thead>
        <tr>
          <th>
            <FormattedMessage id="co-date" />
          </th>
          <th>
            <FormattedMessage id="co-type" />
          </th>
          <th>
            <FormattedMessage id="co-amo" />
          </th>
          <th>
            <FormattedMessage id="co-desc" />
          </th>
          <th>
            <FormattedMessage id="cat-cat" />
          </th>
          <th>
            <FormattedMessage id="tag-tag" />
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(
          ({ id: txnId, transactionTypeId, amount, description, category, tags, date }) => (
            <tr key={txnId}>
              <td>
                <Anchor component={Link} to={`/transactions/${txnId}`}>
                  <FormattedDate value={date} dateStyle="short" timeStyle="short" />
                </Anchor>
              </td>
              <td>
                <Flex align="center">
                  {transactionTypeId === TransactionType.INCOME && (
                    <IconCashBanknote color="green" size="1.3rem" />
                  )}

                  {transactionTypeId === TransactionType.EXPENSE && (
                    <IconCashBanknoteOff color="red" size="1.3rem" />
                  )}

                  {transactionTypeId === TransactionType.TRANSFER && (
                    <IconArrowsExchange color="violet" size="1.3rem" />
                  )}
                </Flex>
              </td>
              <td>{amount}</td>
              <td>{description}</td>
              <td>
                <Group mb="xs">
                  <Badge c={getContrastColor(category.color)} bg={category.color}>
                    {category.name}
                  </Badge>
                </Group>
              </td>
              <td>
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    mr="xs"
                    bg={tag.color}
                    c={getContrastColor(tag.color)}
                    variant="filled">
                    {tag.name}
                  </Badge>
                ))}
              </td>
            </tr>
          )
        )}
      </tbody>
    </Table>
  );
}

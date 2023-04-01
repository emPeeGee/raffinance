import React from 'react';

import { Badge, Flex, Group, Table } from '@mantine/core';
import { IconArrowsExchange, IconCashBanknote, IconCashBanknoteOff } from '@tabler/icons-react';
import { FormattedDate } from 'react-intl';

import { getContrastColor } from 'utils';

import { TransactionModel, TransactionType } from '../transactions.model';

interface Props {
  transactions: TransactionModel[];
}

export function TransactionTable({ transactions }: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Date</th>
          {/* TODO: type as transaction text */}
          <th>Type</th>
          <th>Amount</th>
          <th>Description</th>
          <th>Category</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(
          ({ id: txnId, transactionTypeId, amount, description, category, tags, date }) => (
            <tr key={txnId}>
              <td>
                <FormattedDate value={date} dateStyle="short" timeStyle="short" />
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: category.color,
                      marginRight: '8px'
                    }}
                  />

                  <Group mb="xs">
                    <Badge c={category.color}>{category.name}</Badge>
                  </Group>
                </div>
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

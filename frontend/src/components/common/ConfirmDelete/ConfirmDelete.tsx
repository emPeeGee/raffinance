import React, { useState } from 'react';

import { Text, Alert, TextInput, Group, Button } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useIntl, FormattedMessage } from 'react-intl';

interface Props {
  onClose: () => void;
  onDelete: () => void;
  confirmName: string;
  label: string;
}

export function ConfirmDelete({ confirmName, label, onClose, onDelete }: Props) {
  const [isDisabled, setIsDisabled] = useState(true);
  const { formatMessage } = useIntl();

  const handleConfirmName = (value: string) => {
    if (value === confirmName) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  return (
    <>
      <Text fz="sm" mb="md">
        <FormattedMessage
          id="co-undone"
          values={{
            name: (
              <Text span fw={700}>
                [{confirmName}]
              </Text>
            )
          }}
        />
      </Text>

      <Alert icon={<IconAlertCircle size="1rem" />} color="red" my="md">
        {formatMessage({ id: 'co-undone2' })}
      </Alert>
      <TextInput
        label={label}
        onChange={(ev) => handleConfirmName(ev.target.value)}
        data-autofocus
        color="red"
      />
      <Group mt="md" position="right">
        <Button variant="outline" color="dark" onClick={onClose}>
          {formatMessage({ id: 'co-cancel' })}
        </Button>
        <Button color="red" variant="filled" disabled={isDisabled} onClick={onDelete}>
          {formatMessage({ id: 'co-delete' })}
        </Button>
      </Group>
    </>
  );
}

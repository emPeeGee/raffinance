import React, { useState } from 'react';

import {
  TextInput,
  Select,
  Button,
  NumberInput,
  Container,
  createStyles,
  rem,
  Title,
  Flex,
  ColorInput,
  Group,
  Loader
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconArrowBackUp,
  IconBolt,
  IconCurrency,
  IconMoneybag,
  IconSignature
} from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { useAccountStore } from 'store';
import { CURRENCY_LIST, DateUnit, SWATCHES, noop } from 'utils';

import { CreateAccountDTO } from '../accounts.model';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(64),
    paddingBottom: rem(120)
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  }
}));

export function AccountForm() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateAccountDTO>({
    mode: 'onChange'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addAccount } = useAccountStore();
  const navigate = useNavigate();

  const create = async (acc: CreateAccountDTO) => {
    setIsLoading(true);
    console.log(acc);
    const success = await addAccount(acc);

    if (success) {
      navigate(`../accounts`);
    } else {
      showNotification({
        title: formatMessage({ id: 'acc-f-title' }),
        message: formatMessage({ id: 'acc-f-desc' }),
        color: 'red',
        autoClose: DateUnit.second * 5
      });

      setIsLoading(false);
    }
  };
  // /* TODO: Description for every field */
  return (
    <Container className={classes.root}>
      <Button
        component={Link}
        to="/accounts"
        my="2rem"
        variant="light"
        leftIcon={<IconArrowBackUp />}>
        {formatMessage({ id: 'co-back' })}
      </Button>

      <Title className={classes.title}>{formatMessage({ id: 'acc-create' })}</Title>
      <form onSubmit={handleSubmit(create)}>
        <Flex gap="md" direction="column">
          <TextInput
            {...register('name', { required: true, minLength: 2, maxLength: 255, value: '' })}
            label={formatMessage({ id: 'ac-name' })}
            description={formatMessage({ id: 'acc-c-name' })}
            size="md"
            icon={<IconSignature />}
            error={errors.name ? 'Field is invalid' : null}
            required
          />

          <Controller
            name="currency"
            control={control}
            rules={{ required: true, maxLength: 3, minLength: 3 }}
            render={({ field }) => (
              <Select
                {...field}
                label={formatMessage({ id: 'co-cur' })}
                description={formatMessage({ id: 'acc-c-cur' })}
                nothingFound={formatMessage({ id: 'co-no-opts' })}
                required
                searchable
                clearable
                allowDeselect
                size="md"
                icon={<IconCurrency />}
                data={CURRENCY_LIST}
                error={errors.currency ? 'Field is invalid' : null}
              />
            )}
          />

          <Controller
            name="balance"
            control={control}
            rules={{ required: true, maxLength: 3, minLength: 3 }}
            render={({ field }) => (
              <NumberInput
                {...field}
                required
                type="number"
                label={formatMessage({ id: 'co-bal' })}
                description={formatMessage({ id: 'acc-c-bal' })}
                size="md"
                min={0}
                stepHoldDelay={500}
                stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                icon={<IconMoneybag size="1rem" />}
                error={errors.balance ? 'Field is invalid' : null}
              />
            )}
          />

          <ColorInput
            {...register('color', { required: true, minLength: 7, maxLength: 7, value: '' })}
            withEyeDropper
            format="hex"
            autoComplete="off"
            onChange={noop}
            size="md"
            swatches={SWATCHES}
            label={formatMessage({ id: 'co-color' })}
            description={formatMessage({ id: 'acc-c-color' })}
            error={errors.color ? 'Field is invalid' : null}
            required
          />
          <Button
            my="md"
            type="submit"
            leftIcon={isLoading ? <Loader size={24} color="white" /> : <IconBolt size={24} />}>
            {formatMessage({ id: 'co-create' })}
          </Button>
        </Flex>
      </form>
    </Container>
  );
}

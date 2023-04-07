import React, { useEffect, useState } from 'react';

import {
  Button,
  ColorInput,
  Container,
  Flex,
  Group,
  Loader,
  NumberInput,
  Select,
  TextInput,
  Title,
  createStyles,
  rem
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
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAccountStore } from 'store';
import { CURRENCY_LIST, DateUnit, SWATCHES } from 'utils';

import { CreateAccountDTO } from '../accounts.model';

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[5]
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  }
}));

export function AccountForm() {
  const { id } = useParams();
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm<CreateAccountDTO>({
    mode: 'onChange',
    defaultValues: { balance: 0 }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addAccount, getAccount, updateAccount } = useAccountStore();
  const navigate = useNavigate();

  const isCreate = id === undefined;

  useEffect(() => {
    const fetchTxn = async () => {
      setIsLoading(true);
      const acc = await getAccount(id as string, false);

      if (!acc) {
        // TODO: handle
        navigate('/accounts');
        return;
      }

      reset({
        name: acc.name,
        balance: acc.balance,
        color: acc.color,
        currency: acc.currency
      });

      setIsLoading(false);
    };

    if (id) {
      fetchTxn();
    }
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const showFailNotification = (isCreate: boolean) => {
    showNotification({
      title: formatMessage({ id: isCreate ? 'acc-f-title' : 'acc-fu-title' }),
      message: formatMessage({ id: isCreate ? 'acc-f-desc' : 'acc-fu-desc' }),
      color: 'red',
      autoClose: DateUnit.second * 5
    });
  };

  const create = async (acc: CreateAccountDTO) => {
    setIsLoading(true);
    console.log(acc);
    const success = await addAccount(acc);

    if (success) {
      navigate(`/accounts`);
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

  const update = async (acc: CreateAccountDTO) => {
    setIsLoading(true);
    if (!id) {
      return;
    }

    const success = await updateAccount(id, { ...acc });
    if (success) {
      navigate(`/accounts`);
    } else {
      showFailNotification(isCreate);
      setIsLoading(false);
    }
  };

  // /* TODO: Description for every field */
  return (
    <Container>
      <Group mb="md">
        <Button component={Link} to="/accounts" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title className={classes.title}>
          {formatMessage({ id: isCreate ? 'acc-create' : 'acc-update' })}
        </Title>
      </Group>

      <form onSubmit={handleSubmit(isCreate ? create : update)}>
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
            rules={{ required: true, min: 0 }}
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
                // TODO: Localization
                error={errors.balance ? 'Field is invalid' : null}
              />
            )}
          />

          <Controller
            name="color"
            control={control}
            rules={{ required: true, minLength: 7, maxLength: 7 }}
            render={({ field }) => (
              <ColorInput
                {...field}
                withEyeDropper
                format="hex"
                autoComplete="off"
                size="md"
                swatches={SWATCHES}
                label={formatMessage({ id: 'co-color' })}
                description={formatMessage({ id: 'acc-c-color' })}
                error={errors.color ? 'Field is invalid' : null}
                required
              />
            )}
          />

          <Button
            my="md"
            type="submit"
            leftIcon={isLoading ? <Loader size={24} color="white" /> : <IconBolt size={24} />}>
            {formatMessage({ id: isCreate ? 'co-create' : 'co-save' })}
          </Button>
        </Flex>
      </form>
    </Container>
  );
}

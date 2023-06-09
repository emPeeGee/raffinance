import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Loader,
  LoadingOverlay,
  NumberInput,
  TextInput,
  Title,
  createStyles,
  rem
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import {
  IconArrowBackUp,
  IconArrowRight,
  IconBolt,
  IconCalendarTime,
  IconMapPin,
  IconMoneybag,
  IconSignature
} from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { MultiPicker, TransactionTypePicker } from 'components';
import { useAccountStore, useCategoriesStore, useTagsStore, useTransactionStore } from 'store';
import { DateUnit, MAX_AVAILABLE_DATE, MIN_AVAILABLE_DATE } from 'utils';

import { CreateTransactionDTO, TransactionModel, TransactionType } from '../transactions.model';

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    fontSize: rem(34),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  whitespace: {
    [theme.fn.smallerThan('md')]: {
      display: 'none'
    }
  }
}));

export function TransactionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { addTransaction, getTransaction, updateTransaction } = useTransactionStore();
  const [transaction, setTransaction] = useState<TransactionModel | null>(null);
  const { formatMessage } = useIntl();

  const { classes } = useStyles();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm<CreateTransactionDTO>({
    mode: 'onChange',
    defaultValues: transaction
      ? {
          ...transaction,
          date: new Date(transaction.date)
        }
      : {
          transactionTypeId: TransactionType.INCOME,
          date: new Date(),
          toAccountId: location?.state?.toAccountId as any // Nav from account, should have account id in route state it
        }
  });

  const [isLoading, setIsLoading] = useState(false);

  const type: TransactionType = watch('transactionTypeId');
  const toAccount = watch('toAccountId');
  const fromAccount = watch('fromAccountId');

  const { categories } = useCategoriesStore();
  const { tags: allTags } = useTagsStore();
  const { accounts } = useAccountStore();

  const isCreate = transaction === undefined || transaction === null;

  useEffect(() => {
    if (navigator.geolocation && isCreate) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            // `http://ip-api.com/json?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const { city, road } = data.address ?? { city: '', road: '' };
          setValue('location', `${road}, ${city}`);
        },
        () => {
          showNotification({
            message: formatMessage({ id: 'co-geo-err' }),
            color: 'blue',
            autoClose: DateUnit.second * 5
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    // Clear fromAccountId, if the type is not transfer
    if (type !== TransactionType.TRANSFER) {
      setValue('fromAccountId', undefined);
    }
  }, [type]);

  useEffect(() => {
    const fetchTxn = async () => {
      setIsLoading(true);
      const txn = await getTransaction(id as string);

      if (!txn) {
        // TODO: handle
        navigate('/transactions');
        return;
      }

      setTransaction(txn);
      reset({
        transactionTypeId: txn.transactionTypeId,
        toAccountId: txn.toAccountId,
        fromAccountId: txn.fromAccountId,
        description: txn.description,
        location: txn.location,
        amount: txn.amount,
        date: new Date(txn.date),
        tagIds: txn.tags?.map((t) => t.id),
        categoryId: txn.category.id
      });

      setIsLoading(false);
    };

    if (id) {
      fetchTxn();
    }
  }, [id]);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const showFailNotification = (isCreate: boolean) => {
    showNotification({
      title: formatMessage({ id: isCreate ? 'txn-f-title' : 'txn-fu-title' }),
      message: formatMessage({ id: isCreate ? 'txn-f-desc' : 'txn-fu-desc' }),
      color: 'red',
      autoClose: DateUnit.second * 5
    });
  };

  const create = async (txn: CreateTransactionDTO) => {
    setIsLoading(true);
    const success = await addTransaction(txn);
    if (success) {
      // TODO: success notif ?
      navigate(`/transactions`);
    } else {
      showFailNotification(isCreate);
      setIsLoading(false);
    }
  };

  const update = async (txn: CreateTransactionDTO) => {
    setIsLoading(true);
    if (!id) {
      return;
    }

    const success = await updateTransaction(id, { ...txn });
    if (success) {
      navigate(`/transactions`);
    } else {
      showFailNotification(isCreate);
      setIsLoading(false);
    }
  };

  const toAccountField = (
    <Controller
      name="toAccountId"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <MultiPicker
          {...field}
          required
          clearable
          value={field.value ? [String(field.value)] : undefined}
          onChange={(e) =>
            e.length === 0 ? field.onChange([]) : field.onChange(parseInt(e[0], 10) || undefined)
          }
          description={formatMessage({ id: 'txn-c-to' })}
          label={formatMessage({ id: 'acc-to' })}
          maxSelectedValues={1}
          error={errors.toAccountId ? formatMessage({ id: 'co-field-inv' }) : null}
          data={accounts
            .filter((a) => a.id !== fromAccount)
            .map((a) => ({
              label: a.name,
              value: String(a.id),
              color: a.color
            }))}
        />
      )}
    />
  );

  const fromAccountField = type === TransactionType.TRANSFER && (
    <Controller
      name="fromAccountId"
      control={control}
      rules={{ required: false }}
      render={({ field }) => (
        <MultiPicker
          {...field}
          value={field.value ? [String(field.value)] : undefined}
          onChange={(e) =>
            e.length === 0 ? field.onChange([]) : field.onChange(parseInt(e[0], 10) || undefined)
          }
          description={formatMessage({ id: 'txn-c-from' })}
          label={formatMessage({ id: 'acc-from' })}
          maxSelectedValues={1}
          error={errors.fromAccountId ? formatMessage({ id: 'co-field-inv' }) : null}
          data={accounts
            .filter((a) => a.id !== toAccount)
            .map((a) => ({
              label: a.name,
              value: String(a.id),
              color: a.color
            }))}
        />
      )}
    />
  );

  return (
    <>
      <Group mb="md">
        <Button component={Link} to="/transactions" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title className={classes.title}>
          {formatMessage({ id: isCreate ? 'txn-create' : 'txn-update' })}
        </Title>
      </Group>
      <form onSubmit={handleSubmit(isCreate ? create : update)}>
        <Flex gap="md" direction="column">
          <Group position="center">
            <Controller
              name="transactionTypeId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TransactionTypePicker
                  {...field}
                  value={String(field.value)}
                  onChange={(v) => field.onChange(parseInt(v, 10) || undefined)}
                />
              )}
            />
          </Group>

          <Grid grow>
            {/* // cols={type === TransactionType.TRANSFER ? 3 : 2}
            // breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}> */}

            {type === TransactionType.TRANSFER ? (
              <>
                <Grid.Col span={5}>{fromAccountField}</Grid.Col>
                <Grid.Col span="content">
                  <Flex justify="center" align="flex-end" pb="0.5rem" h="100%" w="100%">
                    <IconArrowRight size="2rem" />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={5}>{toAccountField}</Grid.Col>
              </>
            ) : (
              <Grid.Col span={5}>{toAccountField}</Grid.Col>
            )}
          </Grid>

          <Grid grow>
            <Grid.Col md={5} sm={12}>
              <Controller
                name="amount"
                control={control}
                rules={{ required: true, maxLength: 3, minLength: 3 }}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    required
                    w="100%"
                    type="number"
                    label={formatMessage({ id: 'co-amo' })}
                    description={formatMessage({ id: 'txn-c-amount' })}
                    size="md"
                    min={0}
                    stepHoldDelay={500}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                    icon={<IconMoneybag size="1rem" />}
                    error={errors.amount ? formatMessage({ id: 'co-field-inv' }) : null}
                  />
                )}
              />
            </Grid.Col>

            <Grid.Col span="content" sm={0} className={classes.whitespace}>
              <Flex justify="center" align="flex-end" pb="0.5rem" h="100%" w="100%">
                <Box w="2rem" />
              </Flex>
            </Grid.Col>

            <Grid.Col md={5} sm={12}>
              <Controller
                name="date"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    clearable
                    w="100%"
                    size="md"
                    label={formatMessage({ id: 'co-date' })}
                    description={formatMessage({ id: 'txn-c-date' })}
                    icon={<IconCalendarTime />}
                    mx="auto"
                    error={errors.date ? formatMessage({ id: 'co-field-inv' }) : null}
                    minDate={MIN_AVAILABLE_DATE}
                    maxDate={MAX_AVAILABLE_DATE}
                  />
                )}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            {...register('description', {
              required: true,
              // minLength: 2,
              maxLength: 255,
              value: ''
            })}
            label={formatMessage({ id: 'co-desc' })}
            description={formatMessage({ id: 'txn-c-desc' })}
            size="md"
            icon={<IconSignature />}
            error={errors.description ? formatMessage({ id: 'co-field-inv' }) : null}
            required
          />

          <Controller
            name="categoryId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <MultiPicker
                {...field}
                required
                value={field.value ? [String(field.value)] : undefined}
                onChange={(e) =>
                  e.length === 0
                    ? field.onChange([])
                    : field.onChange(parseInt(e[0], 10) || undefined)
                }
                description={formatMessage({ id: 'txn-c-cat' })}
                label={formatMessage({ id: 'cat-categ' })}
                maxSelectedValues={1}
                error={errors.categoryId ? formatMessage({ id: 'co-field-inv' }) : null}
                data={categories.map((t) => ({
                  label: t.name,
                  value: String(t.id),
                  icon: t.icon,
                  color: t.color
                }))}
              />
            )}
          />

          <Controller
            name="tagIds"
            control={control}
            render={({ field }) => (
              <MultiPicker
                {...field}
                value={field.value?.map((v) => String(v))}
                onChange={(e) => field.onChange(e?.map((v) => parseInt(v, 10)))}
                label={formatMessage({ id: 'tag-tag' })}
                description={formatMessage({ id: 'txn-c-tag' })}
                error={errors.tagIds ? formatMessage({ id: 'co-field-inv' }) : null}
                data={allTags.map((t) => ({
                  label: t.name,
                  value: String(t.id),
                  icon: t.icon,
                  color: t.color
                }))}
              />
            )}
          />

          <TextInput
            {...register('location', {
              required: false,
              maxLength: 127
            })}
            label={formatMessage({ id: 'co-loc' })}
            description={formatMessage({ id: 'txn-c-loc' })}
            size="md"
            icon={<IconMapPin />}
            error={errors.description ? formatMessage({ id: 'co-field-inv' }) : null}
          />

          <Button
            my="md"
            type="submit"
            leftIcon={isLoading ? <Loader size={24} color="white" /> : <IconBolt size={24} />}>
            {formatMessage({ id: isCreate ? 'co-create' : 'co-save' })}
          </Button>
        </Flex>
      </form>
    </>
  );
}

// TODO: After adding, transactions are not sorted

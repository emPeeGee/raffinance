import React, { useState } from 'react';

import {
  TextInput,
  Button,
  Container,
  createStyles,
  rem,
  Title,
  Flex,
  ColorInput,
  Loader,
  Group
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconArrowBackUp, IconBolt, IconMasksTheater, IconSignature } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { useCategoriesStore } from 'store';
import { DateUnit, SWATCHES, noop } from 'utils';

import { CreateCategoryDTO } from '../categories.model';

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
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  }
}));

export function CategoryCreate() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateCategoryDTO>({
    mode: 'onChange'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addCategory } = useCategoriesStore();
  const navigate = useNavigate();

  const create = async (cat: CreateCategoryDTO) => {
    setIsLoading(true);
    const success = await addCategory(cat);

    if (success) {
      navigate(`../categories`);
    } else {
      showNotification({
        title: formatMessage({ id: 'cat-f-title' }),
        message: formatMessage({ id: 'cat-f-desc' }),
        color: 'red',
        autoClose: DateUnit.second * 5
      });

      setIsLoading(false);
    }
  };

  // /* TODO: Description for every field */
  return (
    <Container className={classes.root}>
      <Group my="lg">
        <Button component={Link} to="/categories" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title className={classes.title}>{formatMessage({ id: 'cat-create' })}</Title>
      </Group>
      <form onSubmit={handleSubmit(create)}>
        <Flex gap="md" direction="column">
          <TextInput
            {...register('name', { required: true, minLength: 2, maxLength: 255, value: '' })}
            label={formatMessage({ id: 'cat-name' })}
            size="md"
            icon={<IconSignature />}
            error={errors.name ? 'Field is invalid' : null}
            required
          />

          {/* // TODO: Selector, but not input */}
          <TextInput
            {...register('icon', { required: true, minLength: 1, maxLength: 128, value: '' })}
            label={formatMessage({ id: 'co-icon' })}
            size="md"
            icon={<IconMasksTheater />}
            error={errors.icon ? 'Field is invalid' : null}
            required
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

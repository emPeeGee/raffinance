import React, { useState } from 'react';

import {
  Button,
  ColorInput,
  Flex,
  Group,
  Loader,
  TextInput,
  Title,
  createStyles,
  rem
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconArrowBackUp, IconBolt, IconSignature } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { IconPicker2 } from 'components';
import { useCategoriesStore } from 'store';
import { DateUnit, SWATCHES } from 'utils';

import { CreateCategoryDTO } from '../categories.model';

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    fontSize: rem(34),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  }
}));

export function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addCategory, updateCategory, getCategory } = useCategoriesStore();
  const category = id ? getCategory(Number(id)) : null;
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateCategoryDTO>({
    mode: 'onChange',
    defaultValues: { ...category }
  });

  // console.log(category);
  const [isLoading, setIsLoading] = useState(false);

  const create = async (cat: CreateCategoryDTO) => {
    setIsLoading(true);
    const success = await addCategory(cat);

    if (success) {
      navigate(`/categories`);
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

  const update = async (cat: CreateCategoryDTO) => {
    setIsLoading(true);
    if (!id) {
      return;
    }

    const success = await updateCategory(Number(id), { ...cat });
    if (success) {
      navigate(`/categories`);
    } else {
      showNotification({
        title: formatMessage({ id: 'cat-fu-title' }),
        message: formatMessage({ id: 'cat-fu-desc' }),
        color: 'red',
        autoClose: DateUnit.second * 5
      });

      setIsLoading(false);
    }
  };

  const isCreate = category === undefined || category === null;

  // If category is null, means is it update and id has something(eg. is user refreshes the page), go back to categories
  if ((category === undefined || category === null) && id !== undefined) {
    navigate('/categories');
  }

  return (
    <>
      <Group mb="md">
        <Button component={Link} to="/categories" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title className={classes.title}>
          {formatMessage({ id: isCreate ? 'cat-create' : 'cat-update' })}
        </Title>
      </Group>
      <form onSubmit={handleSubmit(isCreate ? create : update)}>
        <Flex gap="md" direction="column">
          <TextInput
            {...register('name', { required: true, minLength: 2, maxLength: 255, value: '' })}
            label={formatMessage({ id: 'cat-name' })}
            description={formatMessage({ id: 'cat-c-name' })}
            size="md"
            icon={<IconSignature />}
            error={errors.name ? formatMessage({ id: 'co-field-inv' }) : null}
            required
          />

          <Controller
            name="icon"
            control={control}
            rules={{ required: true, maxLength: 64, minLength: 2 }}
            render={({ field }) => (
              <IconPicker2
                {...field}
                value={field.value ? [String(field.value)] : undefined}
                onChange={(e) =>
                  e.length === 0 ? field.onChange(undefined) : field.onChange(e[0] || undefined)
                }
                singlePick
                withItemLabel
                required
                label={formatMessage({ id: 'co-icon' })}
                description={formatMessage({ id: 'cat-c-icon' })}
                error={errors.icon ? formatMessage({ id: 'co-field-inv' }) : null}
              />
            )}
          />

          <Controller
            name="color"
            control={control}
            rules={{ required: true, maxLength: 7, minLength: 7, value: '' }}
            render={({ field }) => (
              <ColorInput
                {...field}
                withEyeDropper
                format="hex"
                autoComplete="off"
                size="md"
                swatches={SWATCHES}
                label={formatMessage({ id: 'co-color' })}
                description={formatMessage({ id: 'cat-c-color' })}
                error={errors.color ? formatMessage({ id: 'co-field-inv' }) : null}
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
    </>
  );
}
// what is deduplication ???

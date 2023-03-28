import React, { forwardRef, useState } from 'react';

import {
  TextInput,
  Button,
  Container,
  createStyles,
  rem,
  Text,
  Title,
  Flex,
  ColorInput,
  Loader,
  Group,
  Select
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconArrowBackUp, IconBolt, IconSignature } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Iconify } from 'components';
import { useCategoriesStore } from 'store';
import { DateUnit, ICONS, SWATCHES, noop } from 'utils';

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

interface SelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ label, value, ...others }: SelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Iconify icon={value} />
        <Text size="sm">{label}</Text>
      </Group>
    </div>
  )
);
SelectItem.displayName = 'SelectItem';

export function CategoryCreate() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const {
    register,
    handleSubmit,
    control,
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
            description={formatMessage({ id: 'cat-c-name' })}
            size="md"
            icon={<IconSignature />}
            error={errors.name ? 'Field is invalid' : null}
            required
          />

          <Controller
            name="icon"
            control={control}
            rules={{ required: true, maxLength: 64, minLength: 2 }}
            render={({ field }) => (
              <Select
                {...field}
                label={formatMessage({ id: 'co-icon' })}
                nothingFound={formatMessage({ id: 'co-no-opts' })}
                description={formatMessage({ id: 'cat-c-icon' })}
                searchable
                clearable
                required
                allowDeselect
                size="md"
                icon={<Iconify icon={field.value} />}
                itemComponent={SelectItem}
                data={ICONS}
                error={errors.icon ? 'Field is invalid' : null}
                filter={(value: string, item: SelectItemProps) =>
                  item.label.toLowerCase().includes(value.toLowerCase().trim())
                }
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
            description={formatMessage({ id: 'cat-c-color' })}
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
// what is deduplication ???

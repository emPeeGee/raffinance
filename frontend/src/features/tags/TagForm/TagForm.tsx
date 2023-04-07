import React, { forwardRef, useState } from 'react';

import {
  TextInput,
  Button,
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
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Iconify } from 'components';
import { useTagsStore } from 'store';
import { DateUnit, ICONS, SWATCHES } from 'utils';

import { CreateTagDTO } from '../tags.model';

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

interface SelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  value: string;
}

// TODO: reusable, category too
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

// TODO: Rename to both create and edit
export function TagForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addTag, getTag, updateTag } = useTagsStore();
  const tag = id ? getTag(Number(id)) : null;
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreateTagDTO>({
    mode: 'onChange',
    defaultValues: { ...tag }
  });

  console.log(tag);
  const [isLoading, setIsLoading] = useState(false);

  const create = async (t: CreateTagDTO) => {
    setIsLoading(true);
    const success = await addTag(t);

    if (success) {
      navigate(`/tags`);
    } else {
      showNotification({
        title: formatMessage({ id: 'tag-f-title' }),
        message: formatMessage({ id: 'tag-f-desc' }),
        color: 'red',
        autoClose: DateUnit.second * 5
      });

      setIsLoading(false);
    }
  };

  const update = async (t: CreateTagDTO) => {
    setIsLoading(true);
    if (!id) {
      return;
    }

    const success = await updateTag(Number(id), { ...t });
    if (success) {
      navigate(`/tags`);
    } else {
      showNotification({
        title: formatMessage({ id: 'tag-fu-title' }),
        message: formatMessage({ id: 'tag-fu-desc' }),
        color: 'red',
        autoClose: DateUnit.second * 5
      });

      setIsLoading(false);
    }
  };

  const isCreate = tag === undefined || tag === null;

  // If tag is null, means is it update and id has something(eg. is user refreshes the page), go back to tags
  if ((tag === undefined || tag === null) && id !== undefined) {
    navigate('/tags');
  }

  return (
    <>
      <Group mb="md">
        <Button component={Link} to="/tags" variant="light" leftIcon={<IconArrowBackUp />}>
          {formatMessage({ id: 'co-back' })}
        </Button>

        <Title className={classes.title}>
          {formatMessage({ id: isCreate ? 'tag-create' : 'tag-update' })}
        </Title>
      </Group>
      <form onSubmit={handleSubmit(isCreate ? create : update)}>
        <Flex gap="md" direction="column">
          <TextInput
            {...register('name', { required: true, minLength: 2, maxLength: 255, value: '' })}
            label={formatMessage({ id: 'tag-name' })}
            description={formatMessage({ id: 'tag-c-name' })}
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
                description={formatMessage({ id: 'tag-c-icon' })}
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
                description={formatMessage({ id: 'tag-c-color' })}
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
    </>
  );
}
// what is deduplication ???

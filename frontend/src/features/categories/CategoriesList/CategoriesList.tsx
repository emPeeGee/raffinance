import React, { useEffect, useState } from 'react';

import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Menu,
  Modal,
  Paper,
  SimpleGrid,
  Text,
  Title,
  UnstyledButton,
  createStyles,
  rem
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconDotsVertical,
  IconEdit,
  IconInfoCircle,
  IconTrash,
  IconTriangle
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { ConfirmDelete, Iconify } from 'components';
import { useCategoriesStore } from 'store';
import { getContrastColor } from 'utils';

import { NoCategories } from '../NoCategories/NoCategories';

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    fontSize: rem(34),
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  categoryTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  }
}));

export function CategoriesList() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { categories, getCategories, deleteCategory, pending } = useCategoriesStore();
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(
    null
  );

  const [opened, { open, close }] = useDisclosure(false);

  const gotoCategory = (id: number) => () => {
    navigate('/transactions/', { state: { categoryId: String(id) } });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleEditCategory = (id: number) => {
    navigate(`/categories/${id}/edit`);
  };

  const handleDeleteCategory = (id: number, name: string) => {
    setCategoryToDelete({ id, name });
    open();
  };

  const deleteCat = async () => {
    if (!categoryToDelete) {
      return;
    }

    const ok = await deleteCategory(categoryToDelete.id);
    if (ok) {
      notifications.show({
        message: formatMessage({ id: 'co-del-suc' }),
        color: 'green'
      });
    } else {
      notifications.show({
        message: formatMessage({ id: 'co-del-err' }),
        color: 'red'
      });
    }

    close();
  };

  const categoriesContent =
    categories.length > 0 ? (
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 }
        ]}>
        {categories.map(({ id, name, color, icon }) => {
          const textColor = getContrastColor(color);

          return (
            <Paper pos="relative" withBorder p={0} radius="md" key={name} bg={color}>
              <UnstyledButton p="xs" h="100%" w="100%" onClick={gotoCategory(id)} title={name}>
                <Group position="apart" spacing="0.25rem" noWrap>
                  <Flex justify="left" align="center" gap="xs" wrap="nowrap">
                    <Box>
                      <Iconify size="1.6rem" icon={icon} color={textColor} />
                    </Box>
                    <Text color={textColor} lineClamp={3} className={classes.categoryTitle}>
                      {name}
                    </Text>
                  </Flex>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon
                        size="md"
                        variant="light"
                        sx={() => ({
                          backgroundColor: textColor === '#000' ? '#00000028' : '#ffffff70',
                          ':hover': {
                            backgroundColor: textColor === '#000' ? '#00000045' : '#ffffff85'
                          }
                        })}>
                        <IconDotsVertical color={textColor} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Actions</Menu.Label>
                      <Menu.Item
                        icon={<IconEdit size={14} />}
                        onClick={() => handleEditCategory(id)}>
                        {formatMessage({ id: 'co-edi' })}
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        icon={<IconTrash size={14} />}
                        onClick={() => handleDeleteCategory(id, name)}>
                        {formatMessage({ id: 'cat-del' })}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </UnstyledButton>
            </Paper>
          );
        })}
      </SimpleGrid>
    ) : (
      <NoCategories />
    );

  return (
    <>
      {categoryToDelete && (
        <Modal opened={opened} onClose={close} title={formatMessage({ id: 'cat-del' })}>
          <ConfirmDelete
            label={formatMessage({ id: 'cat-name' })}
            onClose={close}
            onDelete={deleteCat}
            confirmName={categoryToDelete.name}
          />
        </Modal>
      )}

      <Group position="apart" mb="md">
        <Title className={classes.title}>{formatMessage({ id: 'cat-categ' })}</Title>
        <Button
          component={Link}
          to="/categories/create"
          variant="light"
          color="pink"
          leftIcon={<IconTriangle />}>
          {formatMessage({ id: 'cat-create' })}
        </Button>
      </Group>

      <Alert icon={<IconInfoCircle size="1rem" />} color="gray" my="lg">
        {formatMessage({ id: 'cat-info' })}
      </Alert>

      {pending ? (
        <Group position="center" p="lg">
          <Loader />
        </Group>
      ) : (
        categoriesContent
      )}
    </>
  );
}

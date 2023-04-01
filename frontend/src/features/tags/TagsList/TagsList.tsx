import React, { useState } from 'react';

import {
  Button,
  Group,
  Title,
  Text,
  createStyles,
  rem,
  Alert,
  Paper,
  ActionIcon,
  SimpleGrid,
  UnstyledButton,
  Loader,
  Flex,
  Box,
  Modal,
  Menu
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconDotsVertical,
  IconEdit,
  IconHeartPlus,
  IconInfoCircle,
  IconTrash
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { ConfirmDelete, Iconify } from 'components';
import { useTagsStore } from 'store';
import { getContrastColor } from 'utils';

import { NoTags } from '../NoTags/NoTags';

// TODO: Breadcrumbs ???

// TODO: styles are identical to categoires
const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32)
    }
  },

  tagTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  }
}));

export function TagsList() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { deleteTag, tags, pending } = useTagsStore();
  const [tagToDelete, setTagToDelete] = useState<{ id: number; name: string } | null>(null);

  const [opened, { open, close }] = useDisclosure(false);

  const gotoTag = (id: number) => () => {
    // Navigate('')
  };

  const handleEditTag = (id: number) => {
    navigate(`/tags/${id}/edit`);
  };

  const handleDeleteTag = (id: number, name: string) => {
    setTagToDelete({ id, name });
    open();
  };

  const onDeleteClick = async () => {
    if (!tagToDelete) {
      return;
    }

    const ok = await deleteTag(tagToDelete.id);
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

  const tagsContent =
    tags.length > 0 ? (
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 }
        ]}>
        {tags.map(({ id, name, color, icon }) => {
          const textColor = getContrastColor(color);

          return (
            <Paper pos="relative" withBorder p={0} radius="md" key={name} bg={color}>
              <UnstyledButton p="xs" h="100%" w="100%" onClick={gotoTag(id)} title={name}>
                {/* // TODO:  clicking on the tag could take the user
                   to a filtered view of transactions that match that tag. */}

                <Group position="apart" spacing="0.25rem" noWrap>
                  <Flex justify="left" align="center" gap="xs" wrap="nowrap">
                    <Box>
                      <Iconify size="1.6rem" icon={icon} color={textColor} />
                    </Box>
                    <Text color={textColor} lineClamp={3} className={classes.tagTitle}>
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
                      <Menu.Item icon={<IconEdit size={14} />} onClick={() => handleEditTag(id)}>
                        {formatMessage({ id: 'co-edi' })}
                      </Menu.Item>
                      <Menu.Item
                        color="red"
                        icon={<IconTrash size={14} />}
                        onClick={() => handleDeleteTag(id, name)}>
                        {formatMessage({ id: 'tag-del' })}
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
      <NoTags />
    );

  return (
    <>
      {tagToDelete && (
        <Modal opened={opened} onClose={close} title={formatMessage({ id: 'tag-del' })}>
          <ConfirmDelete
            label={formatMessage({ id: 'tag-name' })}
            onClose={close}
            onDelete={onDeleteClick}
            confirmName={tagToDelete.name}
          />
        </Modal>
      )}
      <Group position="apart" py="sm">
        <Title className={classes.title}>{formatMessage({ id: 'tag-tag' })}</Title>
        <Button component={Link} to="/tags/create" variant="light" leftIcon={<IconHeartPlus />}>
          {formatMessage({ id: 'tag-create' })}
        </Button>
      </Group>

      <Alert icon={<IconInfoCircle size="1rem" />} color="gray" my="lg">
        {formatMessage({ id: 'tag-info' })}
      </Alert>

      {pending ? (
        <Group position="center" p="lg">
          <Loader />
        </Group>
      ) : (
        tagsContent
      )}
    </>
  );
}

// TODO: suspense for base fetch ?, effects and routes reorganization

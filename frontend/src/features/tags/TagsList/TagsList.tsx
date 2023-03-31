import React from 'react';

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
  Box
} from '@mantine/core';
import { IconEdit, IconHeartPlus, IconInfoCircle } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Iconify } from 'components';
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
  const { tags, pending } = useTagsStore();

  const gotoCategory = (id: number) => () => {
    // Navigate('')
  };

  const handleEditCategory = (id: number) => {
    navigate(`/tags/${id}/edit`);
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
              <UnstyledButton p="xs" h="100%" w="100%" onClick={gotoCategory(id)} title={name}>
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
                  <ActionIcon
                    size="lg"
                    variant="light"
                    sx={() => ({
                      backgroundColor: textColor === '#000' ? '#00000028' : '#ffffff70',

                      ':hover': {
                        backgroundColor: textColor === '#000' ? '#00000045' : '#ffffff85'
                      }
                    })}
                    onClick={() => handleEditCategory(id)}>
                    <IconEdit color={textColor} />
                  </ActionIcon>
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

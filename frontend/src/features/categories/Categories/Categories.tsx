import React, { useEffect } from 'react';

import {
  Button,
  Container,
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
  Modal
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconHeartPlus, IconInfoCircle } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Iconify } from 'components';
import { useCategoriesStore } from 'store';
import { getContrastColor } from 'utils';

import { NoCategories } from '../NoCategories/NoCategories';

// TODO: Breadcrumbs ???

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(120),
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
  },

  value: {
    fontSize: rem(28),
    fontWeight: 700,
    lineHeight: 1
  },

  diff: {
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center'
  }
}));

export function Categories() {
  const { formatMessage } = useIntl();
  const { classes } = useStyles();

  const { categories, getCategories } = useCategoriesStore();

  const [opened, { open, close }] = useDisclosure(false);

  const gotoCategory = (id: number) => () => {
    // Navigate('')
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleEditCategory = (id: number) => {
    open();
  };

  return (
    <Container className={classes.root}>
      <Group position="apart" py="sm">
        <Title className={classes.title}>{formatMessage({ id: 'cat-categ' })}</Title>
        <Button
          component={Link}
          to="/categories/create"
          variant="light"
          leftIcon={<IconHeartPlus />}>
          {formatMessage({ id: 'cat-create' })}
        </Button>
      </Group>

      <Alert icon={<IconInfoCircle size="1rem" />} color="gray" my="lg">
        {formatMessage({ id: 'cat-info' })}
      </Alert>

      {categories.length > 0 ? (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'xs', cols: 1 }
          ]}>
          {categories.map(({ id, name, color, icon }) => {
            const textColor = getContrastColor(color);

            return (
              <Paper
                pos="relative"
                withBorder
                p={0}
                radius="md"
                key={name}
                className={classes.root}
                bg={color}>
                <UnstyledButton p="md" w="100%" onClick={gotoCategory(id)}>
                  {/* // TODO:  clicking on the category could take the user
                   to a filtered view of transactions that match that category. */}

                  <Group position="left">
                    <Iconify icon={icon} color={textColor} />
                    <Text fz="1.5rem" fw={700} color={textColor}>
                      {name}
                    </Text>
                  </Group>
                  <ActionIcon
                    pos="absolute"
                    top={4}
                    right={4}
                    size="lg"
                    variant="transparent"
                    onClick={() => handleEditCategory(id)}>
                    <IconEdit color={textColor} />
                  </ActionIcon>
                </UnstyledButton>
              </Paper>
            );
          })}
        </SimpleGrid>
      ) : (
        <NoCategories />
      )}

      <Modal opened={opened} onClose={close} title={formatMessage({ id: 'co-edit' })} centered>
        {/* Modal content */}
      </Modal>
    </Container>
  );
}

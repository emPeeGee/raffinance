import React, { useState } from 'react';

import {
  Text,
  Anchor,
  Button,
  Checkbox,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Group,
  Loader
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconArrowBackUp, IconBolt, IconLock, IconUserCircle } from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { AuthenticationResponse, CredentialsModel } from 'features/authentication';
import { api } from 'services/http';
import { FetchUserStatus, useAuthStore } from 'store';
import { DateUnit } from 'utils';

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CredentialsModel>({
    mode: 'onChange'
  });

  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, fetchUser } = useAuthStore();

  const getUser = async () => {
    const result = await fetchUser();
    switch (result) {
      case FetchUserStatus.OK:
        navigate(`/profile/`);
        break;
      case FetchUserStatus.ERROR:
      case FetchUserStatus.EXPIRED_TOKEN:
      case FetchUserStatus.NO_TOKEN:
        break;
      // TODO: notifications
      default:
        break;
    }

    if (FetchUserStatus.EXPIRED_TOKEN === result) {
      // TODO: Notification
    }
  };

  // TODO: Not ok
  const signIn = (data: CredentialsModel) => {
    setIsLoading(true);
    api
      .post<CredentialsModel, AuthenticationResponse>({
        url: 'signIn',
        body: data,
        auth: true
      })
      .then((response) => {
        setToken(response.token);
        getUser();
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: formatMessage({ id: 'auth-in-fail-tit' }),
          message: formatMessage({ id: 'auth-in-fail-mes' }),
          color: 'red',
          autoClose: DateUnit.second * 5
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
        <FormattedMessage id="auth-welcome-back" />
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        <FormattedMessage
          id="auth-no-yet"
          values={{
            create: (
              <Anchor size="sm" component={Link} to="/sign-up">
                <FormattedMessage id="acc-create" />
              </Anchor>
            )
          }}
        />
      </Text>

      <form onSubmit={handleSubmit(signIn)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            {...register('username', { required: true, value: '' })}
            required
            label={formatMessage({ id: 'co-usr' })}
            error={errors.username ? formatMessage({ id: 'co-usr-req' }) : null}
            icon={<IconUserCircle size={14} />}
          />

          <PasswordInput
            {...register('password', { required: true, value: '' })}
            required
            my="md"
            label={formatMessage({ id: 'co-passw' })}
            error={errors.password ? formatMessage({ id: 'co-passw-req' }) : null}
            toggleTabIndex={0}
            icon={<IconLock size={16} />}
          />

          <Group position="apart" mt="lg">
            <Checkbox label={formatMessage({ id: 'auth-remem' })} />
            <Anchor component="button" size="sm">
              <FormattedMessage id="auth-forgot" />
            </Anchor>
          </Group>

          <Button
            fullWidth
            mt="xl"
            color="primary"
            type="submit"
            leftIcon={isLoading ? <Loader size={24} color="white" /> : <IconBolt size={24} />}>
            <FormattedMessage id="auth-sign-in" />
          </Button>
          <Button<typeof Link>
            component={Link}
            to="/"
            fullWidth
            variant="outline"
            color="gray"
            my="lg"
            leftIcon={<IconArrowBackUp size={24} />}>
            <FormattedMessage id="auth-home" />
          </Button>
        </Paper>
      </form>
    </Container>
  );
}

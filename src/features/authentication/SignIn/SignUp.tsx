import React, { useState } from 'react';

import {
  Button,
  Container,
  Flex,
  Loader,
  Paper,
  PasswordInput,
  TextInput,
  Title
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconArrowBackUp,
  IconBolt,
  IconLock,
  IconMail,
  IconPhone,
  IconUserCircle,
  IconUserHeart
} from '@tabler/icons-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import {
  AuthenticationResponse,
  CredentialsModel,
  RegistrationModel
} from 'features/authentication';
import { api } from 'services/http';
import { DateUnit } from 'utils';

export function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegistrationModel>({
    mode: 'onChange'
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { formatMessage } = useIntl();

  // TODO: Not ok
  const signUp = (data: RegistrationModel) => {
    setIsLoading(true);
    api
      .post<CredentialsModel, AuthenticationResponse>({
        url: 'signUp',
        body: data,
        auth: true
      })
      .then((response) => {
        showNotification({
          title: formatMessage({ id: 'auth-up-succ-tit' }),
          message: formatMessage({ id: 'auth-up-succ-mes' }),
          color: 'green',
          autoClose: DateUnit.second * 5
        });
        navigate(`/sign-in/`);
        return response;
      })
      .catch((err) => {
        console.log(err);

        showNotification({
          title: formatMessage({ id: 'auth-up-fail-tit' }),
          message: formatMessage({ id: 'auth-up-fail-mes' }),
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
        <FormattedMessage id="auth-welcome" />
      </Title>

      <form onSubmit={handleSubmit(signUp)} autoComplete="off">
        <Paper withBorder shadow="md" p={30} mt={30} mb="6rem" radius="md">
          <Flex direction="column" gap="sm">
            <TextInput
              {...register('username', { required: true, value: '', minLength: 4, maxLength: 64 })}
              required
              label={formatMessage({ id: 'co-usr' })}
              error={errors.username ? formatMessage({ id: 'co-usr-req' }) : null}
              icon={<IconUserCircle size={14} />}
            />

            <PasswordInput
              {...register('password', { required: true, value: '', minLength: 3, maxLength: 255 })}
              required
              autoComplete="off"
              label={formatMessage({ id: 'co-passw' })}
              error={errors.password ? formatMessage({ id: 'co-passw-req' }) : null}
              toggleTabIndex={0}
              icon={<IconLock size={16} />}
            />

            <TextInput
              {...register('email', { required: true, value: '', minLength: 3, maxLength: 255 })}
              required
              label={formatMessage({ id: 'auth-email' })}
              error={errors.email ? formatMessage({ id: 'auth-email-req' }) : null}
              icon={<IconMail size={14} />}
            />

            <TextInput
              {...register('name', { required: true, value: '', minLength: 2, maxLength: 255 })}
              required
              label={formatMessage({ id: 'auth-name' })}
              error={errors.email ? formatMessage({ id: 'auth-name-req' }) : null}
              icon={<IconUserHeart size={14} />}
            />

            <TextInput
              {...register('phone', { required: true, value: '', minLength: 1, maxLength: 16 })}
              required
              label={formatMessage({ id: 'auth-phone' })}
              error={errors.email ? formatMessage({ id: 'auth-phone-req' }) : null}
              icon={<IconPhone size={14} />}
            />

            <Button
              fullWidth
              mt="xl"
              color="primary"
              type="submit"
              leftIcon={isLoading ? <Loader size={24} color="white" /> : <IconBolt size={24} />}>
              <FormattedMessage id="auth-sign-up" />
            </Button>
            <Button<typeof Link>
              component={Link}
              to="/"
              fullWidth
              variant="outline"
              color="gray"
              mb="lg"
              leftIcon={<IconArrowBackUp size={24} />}>
              <FormattedMessage id="auth-home" />
            </Button>
          </Flex>
        </Paper>
      </form>
    </Container>
  );
}

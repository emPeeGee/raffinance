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
import { Link, useNavigate } from 'react-router-dom';

import { AuthenticationResponse, CredentialsModel } from 'features/authentication';
import { api } from 'services/http';
import { useAuthStore } from 'store';
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
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuthStore();

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
        navigate(`/profile/`);
      })
      .catch((err) => {
        console.log(err);
        showNotification({
          title: "We're sorry, but your login was unsuccessful",
          message:
            'Please double-check your credentials and try again. If you continue to experience issues, please contact our support team for assistance.',
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
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <form onSubmit={handleSubmit(signIn)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            {...register('username', { required: true, value: '' })}
            required
            label="Username"
            placeholder="Enter your username"
            error={errors.username ? 'Username is required' : null}
            icon={<IconUserCircle size={14} />}
          />

          <PasswordInput
            {...register('password', { required: true, value: '' })}
            required
            my="md"
            label="Password"
            placeholder="Enter your password"
            error={errors.password ? 'Password is required' : null}
            toggleTabIndex={0}
            icon={<IconLock size={16} />}
          />

          <Group position="apart" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          <Button
            fullWidth
            mt="xl"
            color="primary"
            type="submit"
            leftIcon={isLoading ? <Loader size={24} color="white" /> : <IconBolt size={24} />}>
            Sign in
          </Button>
          <Button<typeof Link>
            component={Link}
            to="/"
            fullWidth
            variant="outline"
            color="gray"
            my="lg"
            leftIcon={<IconArrowBackUp size={24} />}>
            Go home
          </Button>
        </Paper>
      </form>
    </Container>
  );
}

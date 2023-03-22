import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  Anchor,
  Button,
  Checkbox,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  createStyles,
  rem
} from '@mantine/core';
import { IconArrowBackUp, IconBolt, IconLock, IconUserCircle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthenticationResponse, CredentialsModel, UserContext } from 'features/authentication';
import { api } from 'services/http';

const useStyles = createStyles((theme) => ({
  // TODO: Light and dark
  wrapper: {
    minHeight: rem(900),
    filter: 'grayscale(100%)',
    backgroundSize: 'cover',
    backgroundPosition: '-350%',
    backgroundRepeat: 'no-repeat',
    // back theme and light
    backgroundImage:
      // 'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)'
      'url(http://thailandsapria.myspecies.info/sites/thailandsapria.myspecies.info/files/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E9.png)'
  },

  form: {
    borderRight: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: rem(900),
    maxWidth: rem(450),
    paddingTop: rem(80),

    [theme.fn.smallerThan('sm')]: {
      maxWidth: '100%'
    }
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CredentialsModel>({
    mode: 'onChange'
  });

  const { classes } = useStyles();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const userContext = useContext(UserContext);

  useEffect(() => {
    if (userContext?.user) {
      navigate(`/profile/`, {
        replace: true
      });
    }
  }, [userContext?.user]);

  const signIn = (data: CredentialsModel) => {
    setIsLoading(true);
    api
      .post<CredentialsModel, AuthenticationResponse>({
        url: 'signIn',
        body: data,
        auth: true
      })
      .then((response) => {
        userContext?.setToken(response.token);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={classes.wrapper}>
      <LoadingOverlay visible={isLoading} />

      {/* <form onSubmit={handleSubmit(signIn)}>
        // TODO: form validation integration
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

        <Container px={0} my="lg">
          <Button
            fullWidth
            variant="light"
            color="primary"
            type="submit"
            leftIcon={<IconBolt size={24} />}>
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
        </Container>
      </form> */}

      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back to Mantine!
        </Title>

        <TextInput label="Email address" placeholder="hello@gmail.com" size="md" />
        <PasswordInput label="Password" placeholder="Your password" mt="md" size="md" />
        <Checkbox label="Keep me logged in" mt="xl" size="md" />
        <Button fullWidth mt="xl" size="md">
          Login
        </Button>

        <Text ta="center" mt="md">
          Don&apos;t have an account?{' '}
          <Anchor<'a'> href="#" weight={700} onClick={(event) => event.preventDefault()}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}

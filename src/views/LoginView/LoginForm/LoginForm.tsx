import { Box, Button, CircularProgress, Grid, Stack, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import './LoginForm.scss';
import * as Yup from 'yup';
import httpClient from '../../../service';
import { ILogin } from '../../../entities/account';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { updateProjectAuth } from '../../../store/general/actionCreators';

type FormValues = {
  username: string;
  password: string;
};

export const LoginForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const schema = Yup.object().shape({
    username: Yup.string().required('Required field'),
    password: Yup.string().required('Required field')
  });

  const form = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: ''
    },
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(async (values: FormValues) => {
    try {
      setIsLoading(true);
      const res = await httpClient.post<ILogin>('/auth/signin', values);
      if (res.data) {
        Cookies.set('token', res.data.message);
        dispatch(updateProjectAuth(true));
      }
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { formState: { errors } } = form;

  return (
    <form className='LoginForm' onSubmit={form.handleSubmit(onSubmit)}>
      <Stack direction='row' justifyContent='space-between'>
        <h2>Sign in</h2>
        <Box width='130px' className='company-logo'>
          <img
            draggable={false}
            alt={'main-logo'}
            src={'ico/k_data_lab.png'}
          />
        </Box>
      </Stack>

      <Grid container={true} rowSpacing={2}>
        <Grid item={true} xs={12}>
          <Controller
            control={form.control}
            name='username'
            render={({ field, fieldState: { error } }) => (
              <TextField
                variant='standard'
                autoComplete='off'
                label='Username'
                error={!!error?.message}
                fullWidth
                {...field}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <Controller
            control={form.control}
            name='password'
            render={({ field, fieldState: { error } }) => (
              <TextField
                variant='standard'
                autoComplete='off'
                type='password'
                label='Password'
                error={!!error?.message}
                fullWidth
                {...field}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid
          marginTop={2}
          item={true}
          xs={12}
          display='flex'
          justifyContent='flex-end'
        >
          <Button
            type='submit'
            startIcon={isLoading && <CircularProgress size={24} color='inherit' />}
            disabled={isLoading || !!errors.password?.message || !!errors?.username?.message}
          >
            submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

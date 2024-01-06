import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { loginUser } from "../api/authApi";


function Login({ setToken }) {
  const initialValues = {
    username: '',
    password: '',
  };

  const loginSchema = Yup.object({
    username: Yup.string().required('Staff code is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values) => {
    const token = await loginUser(values);
    setToken(token);
  };
  

  return (
    <div className='h-screen w-full flex justify-center items-center text-white' style={{ 
      backgroundImage: `url("/public/images/bgWallpaperLogin.jpg")`,
      backgroundSize: 'cover'
      }}>
      <div className="login-wrapper bg-gray-700 p-8 rounded-md">
      <div className='text-center'>
        
        <span className="text-yellow-300 mx-1 text-2xl"> 
            <ion-icon name="flash"></ion-icon>
        </span><br />
        <span className='text-xl italic'>Sign in to your account</span>
      </div>
  
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          <Form className='p-8'>
            <div className='mb-2'>
              <label>
                <p className='italic'>Staff code</p>
                <Field type="text" name="username" className='bg-gray-600 rounded-md p-2' placeholder="e.g. 72106"/>
              </label>
              <div className="text-red-400">
                <ErrorMessage name="username" component="div" className="custom-error" />
              </div>
            </div>

            <div className='mb-2'>
              <label>
                <p className='italic'>Password</p>
                <Field type="password" name="password" className='bg-gray-600 rounded-md p-2'/>
              </label>
              <div className="text-red-400">
                <ErrorMessage name="password" component="div" className="custom-error" />
              </div>
            </div>

            <div className='text-center mt-6 py-1 px-2 cursor-pointer rounded-lg bg-gray-800 hover:bg-gray-900 transition-all ease-in-out duration-300'>
              <button type="submit">Log In</button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Login;

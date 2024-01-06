import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SettingsSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .when('password', {
      is: (val) => val && val.length > 0,
      then: Yup.string().required('Confirm Password is required'),
    }),
});

function DataSettings() {
  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <div class="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
  <h1 class="border-b py-6 text-4xl font-semibold">Settings</h1>
  <div class="grid grid-cols-8 pt-3 sm:grid-cols-10">


    <div class="col-span-2 hidden sm:block">
      <ul>
        <li class="text-gray-600 mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-gray-700 hover:text-gray-700">Profile</li>
        <li class="text-gray-600 mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-gray-700 hover:text-gray-700">Notification</li>

        <li class="mt-5 cursor-pointer border-l-2 border-l-gray-700 px-2 py-2 font-semibold text-gray-700 transition hover:border-l-gray-700 hover:text-gray-700">Data</li>
      </ul>
    </div>

    <div class="col-span-8 overflow-hidden rounded-xl px-8 shadow">
      <div class="border-b pt-4 pb-8">
        <h1 class="text-gray-700 py-2 text-2xl font-semibold">Data settings</h1>
      </div>


      <div class="grid border-b py-6 sm:grid-cols-2">
        Revoke your  access
        Remove the file after how many days

      </div>

    </div>
  </div>
</div>
  );
};

export default DataSettings;
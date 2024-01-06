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

function NotificationSettings() {
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
    <>
  <div class="grid grid-cols-8 pt-3 sm:grid-cols-10">


    <div class="col-span-2 hidden sm:block">
      <ul>
        <li class="text-gray-600 mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-gray-700 hover:text-gray-700">Profile</li>
        <li class="mt-5 cursor-pointer border-l-2 border-l-gray-700 px-2 py-2 font-semibold text-gray-700 transition hover:border-l-gray-700 hover:text-gray-700">Notifications</li>
        <li class="text-gray-600 mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-gray-700 hover:text-gray-700">Data</li>
      </ul>
    </div>

    <div class="col-span-8 overflow-hidden rounded-xl px-8 shadow">
      <div class="border-b pt-4 pb-8">
        <h1 class="text-gray-700 py-2 text-2xl font-semibold">Notification settings</h1>
      </div>


      <div class="grid border-b py-6 sm:grid-cols-2">
        <div class="">
          <h2 class="text-lg font-semibold leading-4 text-gray-700">Security Alerts</h2>
          <p class="font- text-gray-600 mt-4">Authorized Creation of Chat</p>

          <p class="font- text-gray-600 mt-5">Access to Sensitive and Top-Secret Files</p>

          <p class="font- text-gray-600 mt-6">Shoulder Surfing</p>

        </div>
        <div class="mt-4 flex items-center sm:justify-end">
          <div class="flex flex-col gap-3">
            
            <label for="push" class="mt-4 relative inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" id="push" class="peer sr-only" />
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800"></div>
            </label>
            <label for="email" class="mt-4 relative inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" id="email" class="peer sr-only" />
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800"></div>
            </label>
            <label for="sms" class="mt-4 relative inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" id="sms" class="peer sr-only" />
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800"></div>
            </label>
          </div>
        </div>
      </div>
      <div class="grid border-b py-6 sm:grid-cols-2">
        <div class="">
          <h2 class="text-lg font-semibold leading-4 text-gray-700">File Sharing</h2>
          <p class="font- text-gray-600 mt-4">Message Deleted</p>

          <p class="font- text-gray-600 mt-5">File Deleted</p>


        </div>
        <div class="mt-4 flex items-center sm:justify-end">
          <div class="flex flex-col gap-3">
            
            <label for="push" class="mt-4 relative inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" id="push" class="peer sr-only" />
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800"></div>
            </label>
            <label for="email" class="mt-4 relative inline-flex cursor-pointer items-center">
              <input type="checkbox" value="" id="email" class="peer sr-only" />
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-gray-800"></div>
            </label>

          </div>
        </div>
      </div>
    </div>
  </div>
    </>

  );
};

export default NotificationSettings;
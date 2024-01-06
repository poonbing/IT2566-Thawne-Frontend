import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

function VerifyChatModal({ handlePasswordSubmit, closeVerifyChatModal }) {
  const verificationSchema = Yup.object({
    password: Yup.string().required('Password is required').matches(/^[a-zA-Z0-9_-]+$/, 'Password can only contain alphanumeric characters'),
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Enter Password</h2>
        <Formik
          initialValues={{
            password: '',
          }}
          validationSchema={verificationSchema}
          onSubmit={(values) => {
            handlePasswordSubmit(values.password);
          }}
        >
          {({ errors, touched, values }) => (
            <Form className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="password" className="text-gray-700 mb-2">
                  Password:
                </label>
                <Field
                  type="password"
                  name="password"
                  className="border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                />
                {errors.password && touched.password ? (
                  <div className="text-red-500">{errors.password}</div>
                ): null}
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all ease-in-out duration-300"
                >
                  Submit
                </button>
                <button
                  onClick={closeVerifyChatModal}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all ease-in-out duration-300"
                >
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default VerifyChatModal;

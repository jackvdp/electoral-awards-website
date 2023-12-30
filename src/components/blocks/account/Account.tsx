import React from 'react';
import { FC } from 'react';
import ReusableForm, { InputItem } from 'components/reuseable/Form';
import UserData from 'backend/models/user';
import { useState, useEffect } from 'react';
import { useAuth } from 'auth/AuthProvider';

const Account: FC = () => {

    const [user, setUser] = useState<UserData | null>(null)
    const { fetchUserData } = useAuth()

    useEffect(() => {
        const getUserData = async () => {
            const userData = await fetchUserData()
            setUser(userData)
        }
        getUserData()
    }, []);

    const handleFormSubmit = (values: Record<string, string>) => {
        console.log('Form Values:', values);
    };

    return (
        <section className="wrapper bg-soft-primary">
            <div className='text-center pt-md-8 pt-4'>
                <h3>Account</h3>
            </div>
            <div className="container">
                <div className="p-8">
                    {user && <ReusableForm inputItems={convertToInputItems(user)} submitButtonTitle="Update" onSubmit={handleFormSubmit} />}
                </div>
            </div>
        </section>
    );

};

export default Account;

const convertToInputItems = (userData: UserData): InputItem[] => {
    return [
      {
        title: 'First Name',
        placeholder: 'Enter first name',
        type: 'input',
        name: 'firstname',
        defaultValue: userData.firstname,
      },
      {
        title: 'Last Name',
        placeholder: 'Enter last name',
        type: 'input',
        name: 'lastname',
        defaultValue: userData.lastname,
      },
      {
        title: 'Phone',
        placeholder: 'Enter phone number',
        type: 'input',
        name: 'phone',
        defaultValue: userData.phone,
      },
      {
        title: 'Country',
        placeholder: 'Enter country',
        type: 'input',
        name: 'country',
        defaultValue: userData.country,
      },
      {
        title: 'Birthdate',
        placeholder: 'Enter birthdate',
        type: 'input',
        name: 'birthdate',
        defaultValue: userData.birthdate,
      },
      {
        title: 'Profile Name',
        placeholder: 'Enter profile name',
        type: 'input',
        name: 'profileName',
        defaultValue: userData.profileName,
      },
      {
        title: 'Profile Title',
        placeholder: 'Enter profile title',
        type: 'input',
        name: 'profileTitle',
        defaultValue: userData.profileTitle,
      },
      {
        title: 'Biography',
        placeholder: 'Enter biography',
        type: 'area',
        name: 'biography',
        defaultValue: userData.biography,
      },
      {
        title: 'Position',
        placeholder: 'Enter position',
        type: 'input',
        name: 'position',
        defaultValue: userData.position,
      },
      {
        title: 'Organisation',
        placeholder: 'Enter organisation',
        type: 'input',
        name: 'organisation',
        defaultValue: userData.organisation,
      }
    ];
  };
  
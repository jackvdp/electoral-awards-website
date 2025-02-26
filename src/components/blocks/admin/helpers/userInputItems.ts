import {MutableUserData} from "../../../../backend/models/user";
import {InputItem} from "../../../reuseable/Form";

const inputItems = (userData?: MutableUserData): InputItem[] => {
    return [
        {
            title: 'First Name',
            placeholder: 'Enter first name',
            type: 'input',
            name: 'firstname',
            defaultValue: userData?.firstname || '',
            required: true
        },
        {
            title: 'Last Name',
            placeholder: 'Enter last name',
            type: 'input',
            name: 'lastname',
            defaultValue: userData?.lastname || '',
            required: true
        },
        {
            title: 'Email',
            placeholder: 'Enter email',
            type: 'email',
            name: 'email',
            defaultValue: userData?.email || '',
            required: true
        },
        {
            title: 'Phone',
            placeholder: 'Enter phone',
            type: 'phone',
            name: 'phone',
            defaultValue: userData?.phone || '',
            required: true
        },
        {
            title: 'Country',
            placeholder: 'Enter country',
            type: 'country',
            name: 'country',
            defaultValue: userData?.country || '',
            required: true
        },
        {
            title: 'Biography',
            placeholder: 'Enter biography',
            type: 'area',
            name: 'biography',
            defaultValue: userData?.biography || '',
            required: false
        },
        {
            title: 'Position',
            placeholder: 'Enter position',
            type: 'input',
            name: 'position',
            defaultValue: userData?.position || '',
            required: true
        },
        {
            title: 'Organisation',
            placeholder: 'Enter organisation',
            type: 'input',
            name: 'organisation',
            defaultValue: userData?.organisation || '',
            required: true
        },
        {
            title: 'Role',
            placeholder: 'Select role',
            type: 'select',
            name: 'role',
            defaultValue: userData?.role || 'user',
            required: false,
            options: [
                {label: 'User', value: 'user'},
                {label: 'Admin', value: 'admin'},
            ]
        }
    ];
};

export default inputItems;
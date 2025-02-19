import {MutableUserData} from "../../../backend/models/user";
import {InputItem} from "../../reuseable/Form";

const convertToInputItems = (userData: MutableUserData): InputItem[] => [
    {
        title: 'First Name',
        placeholder: 'Enter first name',
        type: 'input',
        name: 'firstname',
        defaultValue: userData.firstname,
        required: true,
    },
    {
        title: 'Last Name',
        placeholder: 'Enter last name',
        type: 'input',
        name: 'lastname',
        defaultValue: userData.lastname,
        required: true,
    },
    {
        title: 'Phone',
        placeholder: 'Enter phone number',
        type: 'phone',
        name: 'phone',
        defaultValue: userData.phone,
        required: true,
    },
    {
        title: 'Country',
        placeholder: 'Enter country',
        type: 'country',
        name: 'country',
        defaultValue: userData.country,
        required: true,
    },
    {
        title: 'Position',
        placeholder: 'Enter position',
        type: 'input',
        name: 'position',
        defaultValue: userData.position,
        required: true,
    },
    {
        title: 'Organisation',
        placeholder: 'Enter organisation',
        type: 'input',
        name: 'organisation',
        defaultValue: userData.organisation,
        required: true,
    },
    {
        title: 'Biography',
        placeholder: 'Enter biography',
        type: 'area',
        name: 'biography',
        defaultValue: userData.biography,
    },
];

export default convertToInputItems;
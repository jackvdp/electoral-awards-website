import React from "react";
import {User} from "@supabase/supabase-js";
import {MutableUserData} from "../../../backend/models/user";

export const userColumns = [
    {key: 'email', label: 'Email'},
    {key: 'country', label: 'Country'},
    {key: 'firstname', label: 'First Name'},
    {key: 'lastname', label: 'Last Name'},
    {key: 'organisation', label: 'Organisation'},
    {key: 'phone', label: 'Phone'},
    {key: 'position', label: 'Position'},
    {key: 'role', label: 'Role'},
];

export const userHeaders = userColumns.map((col) => col.label);

export const userRow = (user: MutableUserData) => {
    const email = user.email;

    return userColumns.map((col) => {
        let cellContent = '';
        if (col.key === 'email') {
            cellContent = email;
        } else {
            cellContent = (user as Record<string, any>)[col.key] ? String((user as Record<string, any>)[col.key]) : '—';
        }
        return <td key={col.key}> {cellContent} </td>;
    })
}
import React from "react";
import {User} from "@supabase/supabase-js";

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

export const userRow = (user: User) => {
    const metadata = user.user_metadata || {};
    const email = metadata.email || user.email || '—';

    return userColumns.map((col) => {
        let cellContent = '';
        if (col.key === 'email') {
            cellContent = email;
        } else {
            cellContent = metadata[col.key] ? String(metadata[col.key]) : '—';
        }
        return <td key={col.key}> {cellContent} </td>;
    })
}
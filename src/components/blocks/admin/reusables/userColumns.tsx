import React from "react";
import {MutableUserData} from "../../../../backend/models/user";
import {ColumnDef} from "../reusables/DataTable";

export const userColumns: ColumnDef[] = [
    {key: 'email', label: 'Email', sortable: true},
    {key: 'country', label: 'Country', sortable: true},
    {key: 'firstname', label: 'First Name', sortable: true},
    {key: 'lastname', label: 'Last Name', sortable: true},
    {key: 'organisation', label: 'Organisation', sortable: true},
    {key: 'phone', label: 'Phone', sortable: false},
    {key: 'position', label: 'Position', sortable: true},
    {key: 'role', label: 'Role', sortable: true},
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
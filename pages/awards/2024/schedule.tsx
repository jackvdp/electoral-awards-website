import {NextPage} from 'next';
import React from 'react';
import {schedule} from 'data/schedule2024';
import Schedule from "components/pages/schedule";

const Programme: NextPage = () => {
    return (
        <Schedule schedule={schedule}/>
    );
};

export default Programme;
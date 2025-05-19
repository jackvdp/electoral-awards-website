import {NextPage} from 'next';
import React from 'react';
import {schedule} from 'data/schedule2024';
import Schedule from "components/pages/schedule";

const Programme: NextPage = () => {
    return (
        <Schedule
            schedule={schedule}
            headTitle={"Schedule – 20th International Electoral Awards"}
            dates={"Sunday, 15th – Wednesday, 18th December 2024"}
        />
    );
};

export default Programme;
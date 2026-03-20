import {NextPage} from 'next';
import React from 'react';
import {schedule} from 'data/schedule';
import Schedule from "components/pages/schedule";
import {AWARDS_EVENT_ID} from "data/awards-config";

const Programme: NextPage = () => {
    return (
        <Schedule
            schedule={schedule}
            headTitle={"Schedule – 22nd International Electoral Awards"}
            dates={"Saturday, 29th November – Wednesday, 3rd December 2026"}
            eventId={AWARDS_EVENT_ID}
        />
    );
};

export default Programme;

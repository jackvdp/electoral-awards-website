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
            dates={"Sunday, 29th November – Thursday, 3rd December 2026"}
            intro={"The symposium programme will cover core themes including disinformation and electoral trust, inclusive participation, and reflections on the Philippines' 2026 General Elections."}
            eventId={AWARDS_EVENT_ID}
        />
    );
};

export default Programme;

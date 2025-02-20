// components/admin/UpdateEventModal.tsx
import React, {FC, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {IEvent} from 'backend/models/event';
import {useRouter} from 'next/router';

interface UpdateEventModalProps {
    modalID: string;
    eventData: IEvent;
    onUpdated: (updatedEvent: IEvent) => void;
}

const UpdateEventModal: FC<UpdateEventModalProps> = ({modalID, eventData, onUpdated}) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleFormSubmit = async (values: Record<string, string>) => {
        setAlertMessage(null);
        setIsUpdating(true);
        try {
            // Send a PUT request to update the event.
            const res = await fetch(`/api/events/${eventData._id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: values.title,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    imageURL: values.imageURL,
                    description: values.description,
                    location: values.location,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAlertMessage(data.error || 'Failed to update event.');
            } else {
                setAlertMessage('Event updated successfully.');
                setCloseModalProgrammatically(true);
                onUpdated(data); // assuming your API returns the updated event
            }
        } catch (error: any) {
            setAlertMessage(error.message);
        }
        setIsUpdating(false);
    };

    const inputItems = (): InputItem[] => {
        return [
            {
                title: 'Title',
                placeholder: 'Enter event title',
                type: 'input',
                name: 'title',
                defaultValue: eventData.title,
                required: true,
            },
            {
                title: 'Start Date',
                placeholder: 'Enter start date',
                type: 'date',
                name: 'startDate',
                // Format date as YYYY-MM-DD for input type="date"
                defaultValue: new Date(eventData.startDate).toISOString().substring(0, 10),
                required: true,
            },
            {
                title: 'End Date',
                placeholder: 'Enter end date',
                type: 'date',
                name: 'endDate',
                defaultValue: new Date(eventData.endDate).toISOString().substring(0, 10),
                required: true,
            },
            {
                title: 'Image URL',
                placeholder: 'Enter image URL (optional)',
                type: 'input',
                name: 'imageURL',
                defaultValue: eventData.imageURL || '',
                required: false,
            },
            {
                title: 'Description',
                placeholder: 'Enter event description',
                type: 'area',
                name: 'description',
                defaultValue: eventData.description,
                required: true,
            },
            {
                title: 'Location',
                placeholder: 'Enter event location',
                type: 'input',
                name: 'location',
                defaultValue: eventData.location,
                required: true,
            },
        ];
    };

    return (
        <Modal
            id={modalID}
            size="xl"
            programmaticClose={{
                closeTriggered: closeModalProgrammatically,
                resetAfterClose: () => setCloseModalProgrammatically(false),
            }}
            content={
                <>
                    <h4 className="mb-3">Update Event</h4>
                    {alertMessage && <p className="text-info">{alertMessage}</p>}
                    <ReusableForm
                        inputItems={inputItems()}
                        submitButtonTitle={isUpdating ? 'Updating...' : 'Update Event'}
                        onSubmit={handleFormSubmit}
                        disableSubmitInitially={false}
                    />
                </>
            }
        />
    );
};

export default UpdateEventModal;
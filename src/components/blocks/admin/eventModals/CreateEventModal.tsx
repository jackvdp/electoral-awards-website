// components/admin/CreateEventModal.tsx
import React, {FC, useState} from 'react';
import Modal from 'components/reuseable/modal/Modal';
import ReusableForm, {InputItem} from 'components/reuseable/Form';
import {useRouter} from 'next/router';

interface CreateEventModalProps {
    modalID: string;
    onCreated: () => void;
}

const CreateEventModal: FC<CreateEventModalProps> = ({modalID, onCreated}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [closeModalProgrammatically, setCloseModalProgrammatically] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleFormSubmit = async (values: Record<string, string>) => {
        setAlertMessage(null);
        setIsCreating(true);
        try {
            // Send a POST request to the API route that creates an event.
            const res = await fetch('/api/events', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: values.title,
                    startDate: values.startDate,
                    endDate: values.endDate,
                    imageURL: values.imageURL,
                    description: values.description,
                    location: values.location,
                    // signups will default to an empty array on the backend.
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setAlertMessage(data.error || 'Failed to create event.');
            } else {
                setAlertMessage('Event created successfully.');
                setCloseModalProgrammatically(true);
                onCreated();
            }
        } catch (error: any) {
            setAlertMessage(error.message);
        }
        setIsCreating(false);
    };

    const inputItems = (): InputItem[] => {
        return [
            {
                title: 'Title',
                placeholder: 'Enter event title',
                type: 'input',
                name: 'title',
                defaultValue: '',
                required: true,
            },
            {
                title: 'Start Date',
                placeholder: 'Enter start date',
                type: 'input', // use 'date' if supported by your ReusableForm
                name: 'startDate',
                defaultValue: '',
                required: true,
            },
            {
                title: 'End Date',
                placeholder: 'Enter end date',
                type: 'input', // use 'date' if supported
                name: 'endDate',
                defaultValue: '',
                required: true,
            },
            {
                title: 'Image URL',
                placeholder: 'Enter image URL (optional)',
                type: 'input',
                name: 'imageURL',
                defaultValue: '',
                required: false,
            },
            {
                title: 'Description',
                placeholder: 'Enter event description',
                type: 'area',
                name: 'description',
                defaultValue: '',
                required: true,
            },
            {
                title: 'Location',
                placeholder: 'Enter event location',
                type: 'input',
                name: 'location',
                defaultValue: '',
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
                    <h4 className="mb-3">Create Event</h4>
                    {alertMessage && <p className="text-info">{alertMessage}</p>}
                    <ReusableForm
                        inputItems={inputItems()}
                        submitButtonTitle={isCreating ? 'Creating...' : 'Create Event'}
                        onSubmit={handleFormSubmit}
                        disableSubmitInitially={false}
                    />
                </>
            }
        />
    );
};

export default CreateEventModal;
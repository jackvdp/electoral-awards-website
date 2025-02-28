// components/admin/SpeakersManager.tsx
import React, {FC, useState, useEffect} from 'react';

export interface Speaker {
    name: string;
    description: string;
    imageURL?: string;
}

interface SpeakersManagerProps {
    initialSpeakers?: Speaker[];
    onChange: (speakers: Speaker[]) => void;
}

const SpeakersManager: FC<SpeakersManagerProps> = ({initialSpeakers = [], onChange}) => {
    const [speakers, setSpeakers] = useState<Speaker[]>(initialSpeakers);
    const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>({
        name: '',
        description: '',
        imageURL: ''
    });

    // Update parent component when speakers change
    useEffect(() => {
        onChange(speakers);
    }, [speakers, onChange]);

    const handleSpeakerChange = (field: keyof Speaker, value: string) => {
        setCurrentSpeaker(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addSpeaker = () => {
        if (currentSpeaker.name && currentSpeaker.description) {
            setSpeakers(prev => [...prev, {...currentSpeaker}]);
            setCurrentSpeaker({
                name: '',
                description: '',
                imageURL: ''
            });
        }
    };

    const removeSpeaker = (index: number) => {
        setSpeakers(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="mt-4">
            <h5 className="mb-3">Event Speakers</h5>

            {/* Display added speakers */}
            {speakers.length > 0 && (
                <div className="mb-3">
                    <h6>Added Speakers:</h6>
                    <div className="list-group">
                        {speakers.map((speaker, index) => (
                            <div key={index}
                                 className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{speaker.name}</strong>
                                    <p className="mb-0 text-muted small">{speaker.description}</p>
                                    {speaker.imageURL && <small>Image URL added</small>}
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeSpeaker(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add new speaker form */}
            <div className="p-3 mb-3">
                <h6 className={"text-muted"}>Add a Speaker</h6>

                <div className="row">
                    <div className="mb-3 col-md-6">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Speaker name"
                            value={currentSpeaker.name}
                            onChange={(e) => handleSpeakerChange('name', e.target.value)}
                        />
                    </div>

                    <div className="mb-3 col-md-6">
                        <label className="form-label">Image URL (optional)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Speaker image URL"
                            value={currentSpeaker.imageURL}
                            onChange={(e) => handleSpeakerChange('imageURL', e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        placeholder="Speaker description"
                        value={currentSpeaker.description}
                        onChange={(e) => handleSpeakerChange('description', e.target.value)}
                    />
                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addSpeaker}
                    disabled={!currentSpeaker.name || !currentSpeaker.description}
                >
                    Add Speaker
                </button>
            </div>
        </div>
    );
};

export default SpeakersManager;
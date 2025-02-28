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
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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

    const editSpeaker = (index: number) => {
        setCurrentSpeaker({...speakers[index]});
        setEditingIndex(index);
        setIsEditing(true);
    };

    const updateSpeaker = () => {
        if (editingIndex !== null && currentSpeaker.name && currentSpeaker.description) {
            setSpeakers(prev =>
                prev.map((speaker, i) =>
                    i === editingIndex ? {...currentSpeaker} : speaker
                )
            );
            setCurrentSpeaker({
                name: '',
                description: '',
                imageURL: ''
            });
            setEditingIndex(null);
            setIsEditing(false);
        }
    };

    const cancelEditing = () => {
        setCurrentSpeaker({
            name: '',
            description: '',
            imageURL: ''
        });
        setEditingIndex(null);
        setIsEditing(false);
    };

    const moveSpeakerUp = (index: number) => {
        if (index === 0) return; // Already at the top
        setSpeakers(prev => {
            const newSpeakers = [...prev];
            [newSpeakers[index - 1], newSpeakers[index]] = [newSpeakers[index], newSpeakers[index - 1]];
            return newSpeakers;
        });
    };

    const moveSpeakerDown = (index: number) => {
        if (index === speakers.length - 1) return; // Already at the bottom
        setSpeakers(prev => {
            const newSpeakers = [...prev];
            [newSpeakers[index], newSpeakers[index + 1]] = [newSpeakers[index + 1], newSpeakers[index]];
            return newSpeakers;
        });
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
                                <div className="d-flex align-items-center">
                                    <div className="speaker-order-controls me-3">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary d-block mb-1"
                                            onClick={() => moveSpeakerUp(index)}
                                            disabled={index === 0}
                                        >
                                            <i className="fas fa-chevron-up"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary d-block"
                                            onClick={() => moveSpeakerDown(index)}
                                            disabled={index === speakers.length - 1}
                                        >
                                            <i className="fas fa-chevron-down"></i>
                                        </button>
                                    </div>
                                    <div>
                                        <strong>{speaker.name}</strong>
                                        <p className="mb-0 text-muted small">{speaker.description}</p>
                                        {speaker.imageURL && <small className="text-info">Image URL added</small>}
                                    </div>
                                </div>
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => editSpeaker(index)}
                                        disabled={isEditing}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeSpeaker(index)}
                                        disabled={isEditing}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add/Edit speaker form */}
            <div className="card p-3 mb-3">
                <h6 className="text-muted">{isEditing ? "Edit Speaker" : "Add a Speaker"}</h6>

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
                            value={currentSpeaker.imageURL || ''}
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

                {isEditing ? (
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={updateSpeaker}
                            disabled={!currentSpeaker.name || !currentSpeaker.description}
                        >
                            Update Speaker
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelEditing}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addSpeaker}
                        disabled={!currentSpeaker.name || !currentSpeaker.description}
                    >
                        Add Speaker
                    </button>
                )}
            </div>
        </div>
    );
};

export default SpeakersManager;
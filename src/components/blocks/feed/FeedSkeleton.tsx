import { FC } from 'react';

const FeedSkeleton: FC = () => {
    return (
        <div className="d-flex flex-column gap-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="card shadow-lg rounded-4 p-4">
                    <div className="d-flex align-items-center mb-3">
                        <div
                            className="rounded-circle bg-light"
                            style={{ width: 44, height: 44 }}
                        />
                        <div className="ms-3">
                            <div className="bg-light rounded" style={{ width: 140, height: 14, marginBottom: 6 }} />
                            <div className="bg-light rounded" style={{ width: 90, height: 12 }} />
                        </div>
                    </div>
                    <div className="bg-light rounded mb-2" style={{ width: '100%', height: 14 }} />
                    <div className="bg-light rounded mb-2" style={{ width: '80%', height: 14 }} />
                    <div className="bg-light rounded" style={{ width: '60%', height: 14 }} />
                </div>
            ))}
        </div>
    );
};

export default FeedSkeleton;

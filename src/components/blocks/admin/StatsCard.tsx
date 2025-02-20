// components/admin/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({title, value, icon, color}) => {
    return (
        <div className="col-md-4">
            <div className="card shadow-lg lift h-100">
                <div className="card-body">
                    <div className="d-flex flex-row align-items-center">
                        <div>
                            <div className={`icon btn btn-circle btn-lg btn-soft-${color} pe-none me-4`}>
                                <i className={`uil ${icon}`}></i>
                            </div>
                        </div>
                        <div>
                            <h3 className="counter mb-1">{value}</h3>
                            <p className="mb-0">{title}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
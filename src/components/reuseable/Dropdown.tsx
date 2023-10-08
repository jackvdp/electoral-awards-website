import { useState } from "react";

export type TabItem = {
    title: string;
    content: JSX.Element;
    icon: JSX.Element;
};

export type DropdownTabsProps = {
    items: TabItem[];
};

export const DropdownTabs: React.FC<DropdownTabsProps> = ({ items }) => {
    const [activeTab, setActiveTab] = useState<number | 'all'>('all');

    const handleTabChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === "all") {
            setActiveTab('all');
        } else {
            setActiveTab(parseInt(value));
        }
    };

    return (
        <>
            <div className="form-select-wrapper">
                <select 
                    className="form-select" 
                    aria-label="Tab selection" 
                    value={activeTab.toString()}
                    onChange={handleTabChange}
                >
                    <option value="all">All</option>
                    {items.map((item, index) => (
                        <option key={index} value={index}>{item.title}</option>
                    ))}
                </select>
            </div>

            <div className="tab-content mt-3">
                {activeTab === 'all' &&
                    items.map((item, index) => (
                        <div key={index} className="tab-pane fade show active">
                            {item.content}
                        </div>
                    ))
                }

                {typeof activeTab === 'number' &&
                    <div className="tab-pane fade show active">
                        {items[activeTab].content}
                    </div>
                }
            </div>
        </>
    );
}

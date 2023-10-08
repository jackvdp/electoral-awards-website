import { useState } from "react";

export type TabItem = {
    title: string;
    content: JSX.Element;
    icon: JSX.Element;
};

export type TabBarProps = {
    items: TabItem[];
};

export const TabBarAndContent: React.FC<TabBarProps> = ({ items }) => {
    const [activeTab, setActiveTab] = useState<number | 'all'>('all');

    const handleTabClick = (tabId: number | 'all') => {
        setActiveTab(tabId);
    };

    return (
        <>
            <ul className="nav nav-tabs nav-tabs-basic justify-content-center">
                <li className="nav-item mb-2">
                    <a className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabClick('all')}>
                        <i className="uil uil-list-ul pe-1" />
                        <span>All</span>
                    </a>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="nav-item mb-2">
                        <a className={`nav-link ${index === activeTab ? 'active' : ''}`} onClick={() => handleTabClick(index)}>
                            {item.icon}
                            <span>{item.title}</span>
                        </a>
                    </li>
                ))}
            </ul>

            <div className="tab-content">
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

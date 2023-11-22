import React from 'react';

type TabBarProps = {
    tabs: string[];
    selectedTab: string;
    onSelect: (tab: string) => void;
};

const TabBar: React.FC<TabBarProps> = ({ tabs, selectedTab, onSelect }) => {
    return (
        <>
            <ul className="nav nav-tabs nav-tabs-basic">
                {tabs.map((tab, index) => (
                    <li className={`nav-item`} key={index}>
                        <a className={`nav-link ${tab === selectedTab ? 'active' : ''} `}
                           onClick={() => onSelect(tab)}
                           href="#">
                            {tab}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default TabBar;

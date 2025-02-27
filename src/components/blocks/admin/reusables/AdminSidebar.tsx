// components/admin/AdminSidebar.tsx
import React from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {useRouter} from 'next/router';

export interface SidebarLink {
    title: string;
    url: string;
    icon: string;
}

interface AdminSidebarProps {
    links: SidebarLink[];
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({links}) => {
    const router = useRouter();
    return (
        <div className="">
            <div className="">
                <div className="list-group list-group-flush">
                    {links.map((link) => {
                        // extract tab value from link url; expects /admin/admin?tab=users etc.
                        const tabValue = new URL(link.url, 'http://dummy').searchParams.get('tab');
                        const active = router.query.tab === tabValue;
                        return (
                            <NextLink
                                key={link.url}
                                href={link.url}
                                title={
                                    <div className="d-flex align-items-center">
                                        <i className={`uil ${link.icon} fs-20 me-3`}></i>
                                        <span>{link.title}</span>
                                    </div>
                                }
                                className={`list-group-item list-group-item-action d-flex align-items-center ${active ? 'active' : ''}`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
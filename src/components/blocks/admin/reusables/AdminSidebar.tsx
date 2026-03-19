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
    collapsed?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({links, collapsed = false}) => {
    const router = useRouter();
    return (
        <div>
            <div className="list-group list-group-flush">
                {links.map((link) => {
                    const parsed = new URL(link.url, 'http://dummy');
                    const tabValue = parsed.searchParams.get('tab');
                    const active = tabValue
                        ? router.query.tab === tabValue
                        : router.asPath === link.url;
                    return (
                        <NextLink
                            key={link.url}
                            href={link.url}
                            title={
                                collapsed ? (
                                    <div className="d-flex align-items-center justify-content-center" title={link.title}>
                                        <i className={`uil ${link.icon} fs-20`}></i>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center">
                                        <i className={`uil ${link.icon} fs-20 me-3`}></i>
                                        <span>{link.title}</span>
                                    </div>
                                )
                            }
                            className={`list-group-item list-group-item-action d-flex align-items-center ${active ? 'active' : ''} ${collapsed ? 'justify-content-center px-0' : ''}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default AdminSidebar;

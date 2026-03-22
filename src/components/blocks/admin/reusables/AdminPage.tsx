import React, { useState } from 'react';
import AdminSidebar, {SidebarLink} from 'components/blocks/admin/reusables/AdminSidebar';

interface DashboardProps {
    title: string;
    children: React.ReactNode;
}

const AdminPage: React.FC<DashboardProps> = ({children, title}) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const sidebarLinks: SidebarLink[] = [
        {title: 'Users', url: '/admin/dashboard?tab=users', icon: 'uil-users-alt'},
        {title: 'Upcoming Events', url: '/admin/dashboard?tab=future-events', icon: 'uil-calendar-alt'},
        {title: 'Past Events', url: '/admin/dashboard?tab=past-events', icon: 'uil-calendar-slash'},
        {title: 'Articles', url: '/admin/dashboard?tab=articles', icon: 'uil-document-layout-left'},
        {title: 'Comms Plan', url: '/admin/comms-plan', icon: 'uil-envelope-send'},
        {title: 'Email Reply', url: '/admin/email-reply', icon: 'uil-envelope-edit'},
    ];

    return (
        <div className="wrapper bg-light">
            <div className="py-8 py-md-10 px-4 px-lg-8">
                <div className="row mb-8">
                    <div className="col-12">
                        <h1 className="display-6 mb-0">{title}</h1>
                    </div>
                </div>

                <div className="row gy-12">
                    {/* Sidebar */}
                    <div
                        style={{
                            width: sidebarCollapsed ? 60 : undefined,
                            transition: 'width 0.2s ease',
                            flexShrink: 0,
                        }}
                        className={sidebarCollapsed ? '' : 'col-md-4 col-lg-2'}
                    >
                        <div style={{ position: 'sticky', top: '2rem' }}>
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className="btn btn-sm p-0 mb-3 text-muted"
                                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                style={{ background: 'none', border: 'none', fontSize: '1.2rem', width: '100%', textAlign: sidebarCollapsed ? 'center' : 'right' }}
                            >
                                <i className={`uil ${sidebarCollapsed ? 'uil-angle-right-b' : 'uil-angle-left-b'}`}></i>
                            </button>
                            <AdminSidebar links={sidebarLinks} collapsed={sidebarCollapsed} />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className={sidebarCollapsed ? 'col' : 'col-md-8 col-lg-10'}>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;

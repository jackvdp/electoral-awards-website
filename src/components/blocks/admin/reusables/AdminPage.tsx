import React from 'react';
import AdminSidebar, {SidebarLink} from 'components/blocks/admin/reusables/AdminSidebar';

interface DashboardProps {
    title: string;
    children: React.ReactNode;
}

const AdminPage: React.FC<DashboardProps> = ({children, title}) => {

    const sidebarLinks: SidebarLink[] = [
        {title: 'Users', url: '/admin/dashboard?tab=users', icon: 'uil-users-alt'},
        {title: 'Events', url: '/admin/dashboard?tab=events', icon: 'uil-calendar-alt'},
        {title: 'Articles', url: '/admin/dashboard?tab=articles', icon: 'uil-document-layout-left'},
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
                    <div className="col-md-4 col-lg-3">
                        <AdminSidebar links={sidebarLinks}/>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-8 col-lg-9">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
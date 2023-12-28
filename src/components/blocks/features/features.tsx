import { FC } from 'react';
import styles from './features.module.css';

const Features: FC = () => {
    return (
        <div className={"container py-4 py-md-8"}>
            <div className='text-center'>
                <h2 className="text-uppercase text-muted mb-12">Membership Features</h2>
            </div>
            <div className="row gx-md-8 gx-xl-12 gy-10">
                {membershipFeatures.map((item) => (
                    <div className="col-lg-6" key={item.id}>
                        <div className="d-flex flex-row">
                            <div>
                                <span className="icon btn btn-sm btn-circle btn-primary pe-none me-5">
                                    <i className="uil uil-lightbulb" />
                                </span>
                            </div>
                            <div>
                                <h4>{item.title}</h4>
                                <p className="mb-0">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;

const membershipFeatures = [
    {
        id: 1,
        title: 'Access to In-Person Events',
        description: `Access industry leading symposiums and the annual International Electoral Awards. Connect with industry leaders, participate in discussions, and celebrate achievements in electoral management with peers from around the world.`
    },
    {
        id: 2,
        title: 'Engaging Webinars',
        description: `Dive into a range of topical webinars led by experts. These sessions offer deep insights into the latest trends and challenges in electoral management, enabling you to stay informed and ahead in your field.`
    },
    {
        id: 3,
        title: 'Informative Articles',
        description: `Access a curated selection of articles and publications. From in-depth analyses to case studies, these resources provide valuable knowledge and perspectives to enhance your understanding and skills in electoral management.`
    },
    {
        id: 4,
        title: 'Connect with Fellow Experts',
        description: `Join a vibrant community of electoral professionals. Share experiences, seek advice, and collaborate on projects. This network is an invaluable tool for building connections and advancing your career in electoral management.`
    }
];

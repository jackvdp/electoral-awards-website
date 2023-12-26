import { NextPage } from 'next';
import { Fragment } from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import dayjs from 'dayjs';
import Link from 'next/link';
import Image from 'next/image';
import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
// -------- custom component -------- //
import { Navbar } from 'components/blocks/navbar';
import { Footer } from 'components/blocks/footer';
import PageProgress from 'components/common/PageProgress';
import CTA from 'components/blocks/call-to-action/CTA';
import { useAuth } from 'auth/AuthProvider';;
import HomeHeader from 'components/blocks/home/HomeHeader';

const Home: NextPage = () => {

    const { isLoggedIn } = useAuth()

    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">
                <HomeHeader />

                <div className="container py-5 py-md-10">

                    <div className="row">
                        <div className="col-md-8">
                            One of three columns
                        </div>
                        <div className="col-md-4">

                            <div className="widget">
                                <h4 className="widget-title mb-3">Popular Posts</h4>

                                <ul className="image-list">
                                    {popularPosts.map(({ id, title, image, comment, date }) => (
                                        <li key={id}>
                                            <NextLink title={<FigureImage width={100} height={100} className="rounded" src={image} />} href="#" />

                                            <div className="post-content">
                                                <h6 className="mb-2">
                                                    <NextLink className="link-dark" title={title} href="#" />
                                                </h6>

                                                <ul className="post-meta">
                                                    <li className="post-date">
                                                        <i className="uil uil-calendar-alt" />
                                                        <span>{dayjs(date).format('DD MMM YYYY')}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>

                <CTA />

            </main>

            <Footer />
        </Fragment>
    );
};

export default Home;

const popularPosts = [
    {
      id: 1,
      comment: 3,
      date: '26 Mar 2022',
      image: '/img/photos/a1.jpg',
      title: 'Magna Mollis Ultricies Magna Mollis Ultricies Magna Mollis Ultricies Magna Mollis Ultricies '
    },
    {
      id: 2,
      comment: 6,
      date: '16 Feb 2022',
      image: '/img/photos/a2.jpg',
      title: 'Ornare Nullam Risus'
    },
    {
      id: 3,
      comment: 5,
      date: '8 Jan 2022',
      image: '/img/photos/a3.jpg',
      title: 'Euismod Nullam Fusce'
    }
  ];

  const FigureImage: FC<FigureImageProps> = (props) => {
    const { className, src, width, height, ...others } = props;
  
    return (
      <figure className={className} {...others}>
        <Image width={width} height={height} src={src} alt="demo" layout="responsive" quality="100" />
      </figure>
    );
  };

  interface FigureImageProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    src: string;
    width: number;
    height: number;
    className?: string;
  }
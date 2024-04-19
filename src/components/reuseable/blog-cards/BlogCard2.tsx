import Link from 'next/link';
import { FC, ReactElement } from 'react';
import NextLink from '../links/NextLink';

// ========================================================
type BlogCard2Props = {
  link: string;
  title: string;
  category: string;
  description: string;
  date: string;
  cardTop: ReactElement;
};
// ========================================================

const BlogCard2: FC<BlogCard2Props> = (props) => {
  const { cardTop, title, category, description, link, date } = props;

  return (
    <article className="post">
      <div className="card">
        {cardTop}

        <div className="card-body">
          <div className="post-header">
            {/* <div className="post-category text-line">
              <NextLink title={category} href="#" className="hover" />
            </div> */}

            <h2 className="post-title mt-1 mb-0">
              <NextLink title={title} className="link-dark" href={link} />
            </h2>
          </div>

          <div className="post-content">
            <p>{description}</p>
          </div>
        </div>

        <div className="card-footer">
          <ul className="post-meta d-flex mb-0">
            <li className="post-date">
              <i className="uil uil-calendar-alt" />
              <span>{date}</span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
};

export default BlogCard2;

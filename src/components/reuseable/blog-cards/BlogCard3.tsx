import { FC } from 'react';
import Link from 'next/link';
import NextLink from '../links/NextLink';
import formatDate from 'helpers/formatArticleDate';
import Style from './BlogCard3.module.css'; 

// ========================================================
type BlogCard3Props = {
  link: string;
  title: string;
  image: string;
  category: string;
  description: string;
  date: string;
};
// ========================================================

const BlogCard3: FC<BlogCard3Props> = (props) => {
  const { title, category, description, link, image, date } = props;

  return (
    <article className="item post col-md-6 d-flex">
      <div className="card flex-fill d-flex flex-column">
        <figure className="card-img-top overlay overlay-1 hover-scale">
          {/* <Link href={link}>
            <a>
              <FigureImage width={560} height={350} src={image} />
              <span className="bg" />
            </a>
          </Link> */}
          <figcaption>
            <h5 className="from-top mb-0">Read More</h5>
          </figcaption>
        </figure>

        <div className="card-body flex-fill d-flex flex-column">
          <div className="post-header">
            {/* <div className="post-category text-line">
              <NextLink title={category} href="#" className="hover" />
            </div> */}

            <h2 className="post-title h3 mt-1 mb-3">
              <NextLink title={title} className="link-dark" href={link} />
            </h2>
          </div>

          <div className={"post-content " + Style.cutText}>
            <p>{description}</p>
          </div>
        </div>

        <div className="card-footer mt-auto">
          <ul className="post-meta d-flex mb-0">
            <li className="post-date">
              <i className="uil uil-calendar-alt" />
              <span>{formatDate(date)}</span>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
};

export default BlogCard3;

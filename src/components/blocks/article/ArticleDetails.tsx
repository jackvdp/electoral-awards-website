import {FC} from 'react';
// -------- custom hook -------- //
import useLightBox from 'hooks/useLightBox';
// -------- custom component -------- //
import FigureImage from 'components/reuseable/FigureImage';
// -------- data -------- //
// import { ArticleProps } from '../../../../pages/articles/[id]';
import ReactMarkdown from 'react-markdown';

interface ArticleProps {
    title: string;
    content: string;
    image: string;
}

const BlogDetailsTemplate: FC<ArticleProps> = (props) => {
    // used for image lightbox
    // useLightBox();

    return (
        <div className="card">
            {/* {
        props.image && <FigureImage width={960} height={600} src={props.image} className="card-img-top" />
      } */}

            <div className="card-body">
                <div className="classic-view">
                    <article className="post">
                        <div className="post-content mb-5">
                            <h2 className="h1 mb-4">{props.title}</h2>
                            <ReactMarkdown>{props.content}</ReactMarkdown>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailsTemplate;
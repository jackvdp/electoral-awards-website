import { FC } from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import { AwardWinner } from 'data/winners';

const WinnerCard: FC<AwardWinner> = ({ awardName, winner, runnersUp }) => {
    return (
        <article className="item post">
            <div className="card bg-soft-primary card-border-top border-primary h-100">
                <div className="card-body d-flex flex-column">
                    <div className="post-header">
                        <h4 className="mb-3">
                            {awardName}
                        </h4>
                    </div>

                    <div className="post-content flex-grow-1">
                        <b>Winner:</b>
                        <p>{winner}</p>
                        {
                            runnersUp &&
                            (
                                <div>
                                    <b>Recognition for Outstanding Achievement:</b>
                                    <ul>
                                        {runnersUp.map((runner, index) => (
                                            <li key={index}>{runner}</li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </article>
    );
};

export default WinnerCard;

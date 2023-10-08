import { FC } from 'react';
import JudgeCard from './JudgesCard';
// -------- data -------- //
import { judges } from 'data/judges';

const Judges: FC = () => {
  return (
    <section
      className="mb-14"
    >
      <div className="container">
        <div className="row">
          <div className="row grid-view gy-6 gy-xl-0 p-6">
            {judges.map((judge, index) => (
              <div className="col-lg-4 col-md-6 mb-4" key={index}>
                <JudgeCard {...judge} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Judges;

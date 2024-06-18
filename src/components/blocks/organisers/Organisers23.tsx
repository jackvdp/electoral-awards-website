import { FC } from 'react';
import TeamCard from './OrganiserCard';
// -------- data -------- //
import organisers from 'data/organisers23';

const Team: FC = () => {
  return (
    <section
      className="mb-14"
    >
      <h2 className="text-uppercase text-muted text-center">Organisers</h2>

      <div className="container">
        <div className="row grid-view gy-6 gy-xl-0 p-md-6">
          {organisers.map((item) => (
            <div className="col-md-6" key={item.id}>
              <TeamCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;

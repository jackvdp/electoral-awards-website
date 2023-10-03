import { FC } from 'react';
import TeamCard from './TeamCard';
// -------- data -------- //
import teams from 'data/team-list';

const Team: FC = () => {
  return (
    <section
      className="wrapper image-wrapper bg-auto no-overlay bg-image mb-14"
    >
      <h2 className="text-uppercase text-muted text-center">Organisers</h2>
      <div className="container">
        <div className="row">
          <div className="row grid-view gy-6 gy-xl-0 p-6">
            {teams.map((item) => (
              <div className="col-md-12 col-xl-6" key={item.id}>
                <TeamCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;

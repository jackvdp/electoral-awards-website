import TeamCard from './OrganiserCard';

const Team = ({ organisers } : {organisers: {
    id: number
    name: string
    image: string
    designation: string
    description: string
  }[] }) => {
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

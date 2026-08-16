import { FC } from 'react';
import SponsorCard from './SponsorCard';
// -------- data -------- //
import { Sponsor, sponsors } from 'data/sponsors';

type SponsorsProps = {
  sponsorList?: Array<Sponsor>
}

const Sponsors: FC<SponsorsProps> = ({ sponsorList = sponsors }) => {
  return (
    <section
      className="my-md-14 my-10"
    >
      <div className="container">
        <div className="row grid-view gy-md-6 gy-xl-0 p-md-6">
          {sponsorList.map((sponsor, index) => (
            <div className="col-lg-4 col-md-6 mb-4" key={index}>
              <SponsorCard id={index} sponsor={sponsor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;

import { FC } from 'react';
import Image from 'next/image';
import { Sponsor } from 'data/sponsors';

type SponsorCardProps = {
  sponsor: Sponsor
  id: number
}

export const SponsorCard: FC<SponsorCardProps> = (props) => {
  const { sponsor, id } = props;
  const modalID = "modal" + id.toString()

  return (
    <div
      className="card"
      data-bs-toggle={sponsor.page ? "modal" : undefined}
      data-bs-target={sponsor.page ? ("#" + modalID) : undefined}
      style={{ cursor: sponsor.page ? 'pointer' : 'default' }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Image width={200} height={200} alt="Sponsor" src={sponsor.logo} objectFit="contain" />
        </div>
        <h4 className="mb-1 text-center">{sponsor.name}</h4>
      </div>

      {/* MODAL */}
      {sponsor.page && (
        <div className="modal fade" id={modalID} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content text-center">
              <div className="modal-body">
                <button className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                <Image
                  width="500"
                  height="707"
                  src={sponsor.page}
                  alt="Sponsor page"
                  objectFit='contain'
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default SponsorCard;
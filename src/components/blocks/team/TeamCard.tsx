import { FC } from 'react';
import Image from 'next/image';
// ==========================================================
type TeamCardProps = {
  name: string;
  image: string;
  designation: string;
  description: string;
};
// ==========================================================

const TeamCard: FC<TeamCardProps> = (props) => {
  const { name, description, designation, image } = props;

  return (
    <div className={`card shadow-lg`}>
      <div className="card-body">
        
        <div className="w-20 mb-4 overflow-hidden">
          <Image width={400} height={400} alt="Team Member" layout="responsive" src={image} objectFit="contain" />
        </div>

        <h4 className="mb-1">{name}</h4>
        <div className="meta mb-2">{designation}</div>
        <p className="mb-2">{description}</p>

      </div>
    </div>
  );
};

export default TeamCard;

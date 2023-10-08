import { FC } from 'react';
import Image from 'next/image';
import { Judge } from 'data/judges';

export const JudgeCard: FC<Judge> = (props) => {
  const { name, country, organisation, title, image } = props;

  return (
    <div className={`card shadow-lg`}>
      <div className="card-body">
        
        <div className="w-20 mb-4 overflow-hidden">
          <Image width={200} height={200} alt="Team Member" layout="responsive" src="/img/judges/t1.jpg" objectFit="contain" />
        </div>

        <h4 className="mb-1">{name}</h4>
        <div className="meta mb-2">{country}</div>
        <p className="mb-2">{title + ", " + organisation}</p>

      </div>
    </div>
  );
};

export default JudgeCard;
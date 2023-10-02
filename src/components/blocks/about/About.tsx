import { FC } from 'react';
import Image from 'next/image';
import NextLink from 'components/reuseable/links/NextLink';

const About: FC = () => {
  return (
    <section id="about">
      <div className="wrapper bg-gray">
        <div className="container py-14 py-md-16">
          <div className="row gx-md-8 gx-xl-12 gy-6 align-items-center">
            <div className="col-md-8 col-lg-6 order-lg-2 mx-auto">
              <div className="img-mask mask-2">
                <Image width={1000} height={850} src="/img/photos/Westminster.jpeg" alt="An image of Westminster" />
              </div>
            </div>

            <div className="col-lg-6">
              <h2 className="display-5 mb-6">About Us</h2>
              <p>
                The International Centre for Parliamentary Studies (ICPS) primarily focuses on empowering human capital through capacity building and training. As a research institution of the United Nations Public Administration Network (UNPAN), ICPS offers a range of training programmes, conferences, and policy discussions to address public policy issues globally. The Centre collaborates with international partners like the UNDP and ACEEEO.
              </p>
              <p>
                ICPS&apos;s comprehensive training programmes equip individuals and organizations with the knowledge and skills to tackle challenges facing governments and public sectors worldwide. The Centre&apos;s training remains relevant and up-to-date, thanks to its research team that constantly develops and updates its programmes. All professional training courses are accredited by The Institute of Leadership and Management (TILM).
              </p>

              <p>
                In addition to open programmes in London, ICPS can tailor or design customized in-house training to meet an organization&apos;s specific needs, which can be conducted at any location worldwide. Participants benefit from networking opportunities and learning from leading international experts and peers, sharing experiences and best practices.
              </p>

              <NextLink title="Learn More" href="https://parlicentre.org/training/international" className="btn btn-primary rounded-pill mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

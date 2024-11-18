// import { Fragment } from "react";
// import { Navbar } from "components/blocks/navbar";
// import { Footer } from "components/blocks/footer";
// import PageProgress from "components/common/PageProgress";
// import SimpleBanner from "components/blocks/banner/SimpleBanner";
// import React, { useState } from "react";
// import visaData from "data/countries_visa_data.json";
// export default function VisaRequirementsPage() {
//     const [searchQuery, setSearchQuery] = useState("");

//     // Filter data based on search query
//     const filteredData = visaData.filter((entry) =>
//         entry.country.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <Fragment>
//             <PageProgress />

//             <Navbar />

//             <main className="content-wrapper">
//                 <SimpleBanner title={"Visa Requirements"}></SimpleBanner>

//                 <div className="container py-10 d-flex flex-column justify-content-center align-items-center">
//                     <div className="container mt-4">
//                         <div className="card">
//                             <div className="card-body">
//                                 <h5 className="card-title mb-4">Visa Requirements</h5>
//                                 <p className="card-text">
//                                     If you need support applying for a visa, please email{" "}
//                                     <a href="mailto:jorgesuncar@yahoo.com">Jorge Suncar</a> from
//                                     the JCE. Include your consulate, passport, and name details so
//                                     the JCE can send you a letter that can assist with the visa
//                                     process. Please also cc{" "}
//                                     <a href="mailto:electoral@parlicentre.org">
//                                         electoral@parlicentre.org
//                                     </a>.
//                                 </p>
//                                 <div className="form-floating mb-3">
//                                     <input
//                                         id="searchInput"
//                                         type="text"
//                                         className="form-control"
//                                         placeholder="Search for a country..."
//                                         value={searchQuery}
//                                         onChange={(e) => setSearchQuery(e.target.value)}
//                                     />
//                                     <label htmlFor="searchInput">Search for a country...</label>
//                                 </div>
//                                 <table className="table table-striped">
//                                     <thead>
//                                         <tr>
//                                             <th style={{ width: "400px" }}>Country</th>
//                                             <th>Requires Visa</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {filteredData.length > 0 ? (
//                                             filteredData.map((entry, index) => (
//                                                 <tr key={index}>
//                                                     <td>{entry.country}</td>
//                                                     <td>{entry.requiresVisa}</td>
//                                                 </tr>
//                                             ))
//                                         ) : (
//                                             <tr>
//                                                 <td colSpan={2} className="text-center">
//                                                     No results found.
//                                                 </td>
//                                             </tr>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             {/* ========== footer section ========== */}
//             <Footer />
//         </Fragment>
//     );
// }


import { Fragment } from "react";
import { Navbar } from "components/blocks/navbar";
import { Footer } from "components/blocks/footer";
import PageProgress from "components/common/PageProgress";
import SimpleBanner from "components/blocks/banner/SimpleBanner";

export default function VisaRequirementsPage() {
    return (
        <Fragment>
            <PageProgress />

            <Navbar />

            <main className="content-wrapper">
                <SimpleBanner title={"Visa Requirements"}></SimpleBanner>

                <div className="container py-10 d-flex flex-column justify-content-center align-items-center">
                    <div className="container mt-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title mb-4">Visa Requirements</h5>
                                <p className="card-text">
                                    If you need support applying for a visa, please email{" "}
                                    <a href="mailto:jorgesuncar@yahoo.com">Jorge Suncar</a> from
                                    the JCE. Include your consulate, passport, and name details so
                                    the JCE can send you a letter that can assist with the visa
                                    process. Please also cc{" "}
                                    <a href="mailto:electoral@parlicentre.org">
                                        electoral@parlicentre.org
                                    </a>.
                                </p>
                                <p className="card-text">
                                    You can download the full list of visa requirements below:
                                </p>
                                <a
                                    href="/data/visarequirements.xlsx"
                                    download="visarequirements.xlsx"
                                    className="btn btn-primary"
                                >
                                    Download Visa Requirements
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ========== footer section ========== */}
            <Footer />
        </Fragment>
    );
}
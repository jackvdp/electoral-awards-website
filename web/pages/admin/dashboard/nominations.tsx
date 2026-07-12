import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import DataTable from 'components/blocks/admin/reusables/DataTable';
import AdminPage from 'components/blocks/admin/reusables/AdminPage';
import { createClient } from 'backend/supabase/server-props';
import { getAllNominations } from 'backend/use_cases/nominations/getAllNominations';

interface SerializedDocument {
    name: string;
    url: string;
    size: number;
    contentType: string;
}

interface SerializedNomination {
    _id: string;
    nominatorName: string;
    nominatorOrganization: string;
    nominatorPosition: string;
    email: string;
    nominatorPhone: string;
    nomineeName: string;
    nomineePosition?: string;
    nomineeOrganization?: string;
    nomineeEmail: string;
    nomineePhone: string;
    awardCategory: string;
    initiativeDescription: string;
    supportingEvidence: string;
    referenceName?: string;
    referencePosition?: string;
    referenceOrganization?: string;
    referenceEmail?: string;
    referencePhone?: string;
    documents: SerializedDocument[];
    createdAt: string;
}

interface NominationsPageProps {
    nominations: SerializedNomination[];
}

const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const NominationsPage: NextPage<NominationsPageProps> = ({ nominations }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Helper function to escape CSV field values
    const escapeCSV = (field: string | null | undefined): string => {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    };

    const generateCSV = (): string => {
        const columns: (keyof SerializedNomination)[] = [
            'createdAt', 'awardCategory',
            'nomineeName', 'nomineePosition', 'nomineeOrganization', 'nomineeEmail', 'nomineePhone',
            'nominatorName', 'nominatorPosition', 'nominatorOrganization', 'email', 'nominatorPhone',
            'referenceName', 'referencePosition', 'referenceOrganization', 'referenceEmail', 'referencePhone',
            'initiativeDescription', 'supportingEvidence',
        ];
        const header = [...columns, 'documents'].join(',');
        const rows = nominations.map(nomination => {
            const cells = columns.map(col => escapeCSV(nomination[col] as string | undefined));
            cells.push(escapeCSV(nomination.documents.map(doc => doc.url).join(' ')));
            return cells.join(',');
        });
        return [header, ...rows].join('\n');
    };

    const handleDownloadCSV = () => {
        try {
            setIsDownloading(true);
            const csv = generateCSV();
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'nominations.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating CSV:', error);
            alert('Failed to generate CSV');
        } finally {
            setIsDownloading(false);
        }
    };

    const headers = ['Submitted', 'Nominee', 'Category', 'Nominator', 'Documents', ''];

    const detailSection = (title: string, body: React.ReactNode) => (
        <div className="mb-4">
            <h6 className="mb-1">{title}</h6>
            {body}
        </div>
    );

    function renderRow(nomination: SerializedNomination) {
        const isExpanded = expandedId === nomination._id;
        return (
            <>
                <tr>
                    <td className="text-nowrap">{formatDate(nomination.createdAt)}</td>
                    <td>
                        <div className="fw-bold">{nomination.nomineeName}</div>
                        {nomination.nomineeOrganization && (
                            <div className="text-muted fs-sm">{nomination.nomineeOrganization}</div>
                        )}
                    </td>
                    <td>{nomination.awardCategory}</td>
                    <td>
                        <div>{nomination.nominatorName}</div>
                        <div className="text-muted fs-sm">{nomination.nominatorOrganization}</div>
                        <a className="fs-sm" href={`mailto:${nomination.email}`}>{nomination.email}</a>
                    </td>
                    <td>
                        {nomination.documents.length === 0 ? (
                            <span className="text-muted">None</span>
                        ) : (
                            nomination.documents.map((doc, i) => (
                                <div key={i}>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                        <i className="uil uil-paperclip me-1"></i>{doc.name}
                                    </a>
                                </div>
                            ))
                        )}
                    </td>
                    <td className="text-end">
                        <button
                            className="btn btn-sm btn-soft-primary rounded-pill"
                            onClick={() => setExpandedId(isExpanded ? null : nomination._id)}
                        >
                            {isExpanded ? 'Hide' : 'Details'}
                        </button>
                    </td>
                </tr>
                {isExpanded && (
                    <tr>
                        <td colSpan={headers.length} className="bg-light">
                            <div className="p-3">
                                {detailSection('Description of the initiative',
                                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{nomination.initiativeDescription}</p>
                                )}
                                {detailSection('Supporting evidence',
                                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{nomination.supportingEvidence}</p>
                                )}
                                {detailSection('Nominee contact',
                                    <p className="mb-0">
                                        {[nomination.nomineePosition, nomination.nomineeOrganization].filter(Boolean).join(', ') || 'No position or organisation given'}
                                        <br />
                                        <a href={`mailto:${nomination.nomineeEmail}`}>{nomination.nomineeEmail}</a> · {nomination.nomineePhone}
                                    </p>
                                )}
                                {detailSection('Nominator contact',
                                    <p className="mb-0">
                                        {nomination.nominatorPosition}, {nomination.nominatorOrganization}
                                        <br />
                                        <a href={`mailto:${nomination.email}`}>{nomination.email}</a> · {nomination.nominatorPhone}
                                    </p>
                                )}
                                {nomination.referenceName && detailSection('Reference',
                                    <p className="mb-0">
                                        {nomination.referenceName}
                                        {nomination.referencePosition && `, ${nomination.referencePosition}`}
                                        {nomination.referenceOrganization && `, ${nomination.referenceOrganization}`}
                                        <br />
                                        {nomination.referenceEmail && (
                                            <><a href={`mailto:${nomination.referenceEmail}`}>{nomination.referenceEmail}</a>{nomination.referencePhone && ' · '}</>
                                        )}
                                        {nomination.referencePhone}
                                    </p>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            </>
        );
    }

    const headerAction = (
        <button
            onClick={handleDownloadCSV}
            disabled={isDownloading || nominations.length === 0}
            className="btn btn-sm btn-success rounded-pill"
        >
            {isDownloading ? 'Downloading...' : 'Download CSV'}
        </button>
    );

    return (
        <AdminPage title="Nominations">
            <Head>
                <title>Admin Dashboard | Nominations</title>
            </Head>
            {nominations.length === 0 ? (
                <div className="card">
                    <div className="card-body">
                        <p className="mb-0">No nominations have been submitted yet.</p>
                    </div>
                </div>
            ) : (
                <DataTable
                    headerTitle={`Nominations (${nominations.length})`}
                    headers={headers}
                    headerAction={headerAction}
                    data={nominations}
                    renderRow={renderRow}
                />
            )}
        </AdminPage>
    );
};

export default NominationsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const supabase = createClient(ctx);

    // Check session; ensure an admin session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.user_metadata.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const nominations = await getAllNominations();

    return {
        props: {
            // Serialize MongoDB objects (ObjectIds, Dates) for Next.js props
            nominations: JSON.parse(JSON.stringify(nominations)),
        },
    };
};

import React, {useEffect, useState} from 'react';
import ImageCard from './ImageCard';
import useLightBox from 'hooks/useLightBox';
import {FolderStructure} from 'backend/aws/helpers/getFilesFolders';
import useProgressbar from 'hooks/useProgressbar';
import TabBar from './ImageGalleryTabBar';

const batchSize = 96;
const allPhotosTag = 'All Photos'

const ImageGallery: React.FC = () => {
    useLightBox();
    useProgressbar(100);
    const [photosFolders, setPhotosFolders] = useState<FolderStructure[]>([]);
    const [renderedImagesCount, setRenderedImagesCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>(allPhotosTag);

    useEffect(() => {
        fetch('/api/images/eventImages')
            .then(response => {
                return response.json()
            })
            .then(data => {
                setPhotosFolders(data);
            });
    }, []);

    useEffect(() => {
        setRenderedImagesCount(batchSize);
    }, [photosFolders, selectedTab]);


    useEffect(() => {
        const loadMoreImages = () => {
            setRenderedImagesCount(prevCount => prevCount + batchSize);
        };
        const handleScroll = () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

            if (window.innerHeight + scrollTop >= scrollHeight - window.innerHeight) {
                if (!loading) {
                    setLoading(true);
                    loadMoreImages();
                }
            } else {
                setLoading(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const flattenFoldersToFiles = (folders: FolderStructure[]): string[] => {
        return folders.flatMap(folder => folder.files);
    }

    const handleTabSelect = (tab: string) => {
        setSelectedTab(tab);
    };

    const getImagesToRender = () => {
        const allFiles = flattenFoldersToFiles(photosFolders);
        if (selectedTab === allPhotosTag) {
            return allFiles.slice(0, renderedImagesCount);
        }

        const selectedFolder = photosFolders.find(folder => folder.folderName === selectedTab);
        return selectedFolder ? selectedFolder.files.slice(0, renderedImagesCount) : [];
    };

    return (
        <main className="content-wrapper">
            <section className="wrapper bg-light px-lg-20 px-md-10 px-2 py-md-10 py-5 container">
                <div className="pb-6 text-center">
                    {photosFolders.length !== 0 && <TabBar
                        tabs={[allPhotosTag, ...photosFolders.map(folder => folder.folderName)]}
                        selectedTab={selectedTab}
                        onSelect={handleTabSelect}/>}
                </div>
                <div className="row gy-6">
                    {photosFolders.length !== 0 ?
                        getImagesToRender().map((file, index) => (
                            <ImageCard key={`${index}-${file}`} imageURL={file}/>
                        ))
                        :
                        <div className='py-8'>
                            <div className="progressbar semi-circle blue" data-value="100"/>
                        </div>
                    }
                </div>
            </section>
        </main>
    );
};

export default ImageGallery;
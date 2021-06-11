import React, { useEffect, useState } from 'react';
import Body from '../Components/Body';
import { InertiaLink } from '@inertiajs/inertia-react';
import axios from 'axios';
import Button from '../Components/Button';

export default function AdsDashboard(props) {
    const [ads, setAds] = useState(null);
    const [action, setAction] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (ads === null && action === null) {
            axios.get(route('listAds'))
                .then(res => {
                    setAds(res.data.ads);
                })
                .catch(function (e) {
                    setAds([]);
                    console.error(e);
                })
        }
    })

    const deleteAd = async (e) => {
        setAction("delete");
        axios.post(route('deleteAd'), {
            "id": e.target.dataset.adId
        })
            .catch(function (e) {
                console.error(e);
            }).finally(() => {
                setAds(null);
                setAction(null);
            });
    }

    const viewMedia = (id) => {
        window.open(route('getMedia', { "id": id }), "_blank", "height=600,width=800");
    }

    if (ads === null || action != null) return <Body props={props} pageName={"ads"} children={<div></div>} isLoading={true} />;

    return (
        <Body props={props} pageName={"ads"} isLoading={false} children={(
            <>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <div className="grid grid-flow-col">
                                    <div className="col-span-8"><p>Ad details</p></div>
                                    <div className="col-span-4 text-right">
                                        <InertiaLink href={route('createAdPage')} className="text-sm text-gray-700 underline mb-4">
                                            Create ad
                                        </InertiaLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            {ads.map((ad, i) => {
                                return (<div key={i} className="p-6 bg-white border-b border-gray-200">
                                    <div className="grid grid-flow-col">
                                        <div className="col-span-8">
                                            <p>{ad.name} (Priority {ad.priority}) - Runs {new Date(ad.startingOn * 1000).toLocaleDateString("en-CA")} to {new Date(ad.endingOn * 1000).toLocaleDateString("en-CA")}</p>
                                        </div>
                                        <div className="col-span-4 text-right inline-block">
                                            <div data-ad-group={ad.id}>
                                                <p className="text-red-500 inline-block cursor-pointer hover:underline" data-ad-id={ad.id} onClick={(e) => {
                                                    deleteAd(e);
                                                }}>Delete</p>
                                                <p className="inline-block">&nbsp;/&nbsp;</p>
                                                <p className="inline-block cursor-pointer hover:underline" data-media-id={ad.usingMediaId} onClick={(e) => {
                                                    viewMedia(e.target.dataset.mediaId);
                                                }}>View</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>);
                            })}
                            {ads.length === 0 && <div className="p-6 bg-white border-b border-gray-200"><p>No ads found...</p></div>}
                        </div>
                    </div>
                </div>
            </>)} />
    );
}

import React, { useEffect, useState, useRef } from 'react';
import Body from '../Components/Body';
import { InertiaLink } from '@inertiajs/inertia-react';
import axios from 'axios';
import Input from '../Components/Input';

export default function AdsDashboard(props) {
    const [ads, setAds] = useState(null);
    const [action, setAction] = useState(null);
    const [sectionId, setSectionId] = useState(null);
    const sectionInputRef = useRef();
    const [sectionResults, setSectionResults] = useState([]);
    const [sectionDictionary, setSectionDictionary] = useState({});

    useEffect(() => {
        if (ads === null && action === null) {
            axios.get(route('listAds'))
                .then(res => {
                    setAds(res.data.ads);
                    const tempSectionDict = {};
                    res.data.sections.map((el, i) => {
                        tempSectionDict['sect' + el.id] = el.name;
                    })
                    setSectionDictionary(tempSectionDict);
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

    const sectionSearch = (name) => {
        if (name.trim().length === 0) {
            setSectionResults([]);
            return;
        }
        axios.get(route('searchSections'), {
            params: {
                "name": name
            }
        })
            .then(res => {
                setSectionResults(res.data.results);
            })
            .catch(function (e) {
                setSectionResults([]);
                console.error(e);
            })
    }

    const updateSectionId = (e) => {
        let sectionId = e.target.dataset.sectionId;
        sectionInputRef.current.value = "Showing only section " + e.target.innerHTML + " (ID " + sectionId + ") ads";
        sectionInputRef.current.disabled = true;
        setSectionId(sectionId);
        setSectionResults([]);
    }

    const sectionInputClicked = (e) => {
        sectionInputRef.current.value = "";
        sectionInputRef.current.disabled = false;
        setSectionId(null);
        setSectionResults([]);
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
                                    <div className="col-span-8"><p>Ad details (All times on this page are in your local time)</p></div>
                                    <div className="col-span-4 text-right">
                                        <InertiaLink href={route('createAdPage')} className="text-sm text-gray-700 underline mb-4">
                                            Create ad
                                        </InertiaLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="bg-white shadow-sm sm:rounded-lg z-50 rounded-md">
                            <div className="p-6 bg-white border-b border-gray-200 rounded-md">
                                <Input
                                    type="text"
                                    name=""
                                    className="mt-1 block w-full disabled:opacity-75"
                                    isFocused={true}
                                    handleChange={
                                        (e) => {
                                            sectionSearch(e.target.value);
                                        }
                                    }
                                    autoComplete={"off"}
                                    customRef={sectionInputRef}
                                    handleOnClick={sectionInputClicked}
                                    placeHolder={`Filter by section...`}

                                />
                                <div style={{
                                    position: "relative",
                                    zIndex: 10,
                                    overflow: "visible"
                                }}
                                    className="rounded-md">
                                    <ul
                                        style={{
                                            height: "100%",
                                            position: "absolute",
                                            top: "5px",
                                            left: 0,
                                        }}
                                        className="w-full text-center md:w-auto md:text-left rounded-md bg-gray-200"
                                    >
                                        {sectionResults.length > 0 && sectionResults.map((v, i) => {
                                            return <li data-section-id={v.id} onClick={updateSectionId} className={`bg-gray-100 min-width-1/4 text-black shadow-md p-2 ${i == 0 ? "rounded-t-md" : ""} ${i == sectionResults.length - 1 ? "rounded-b-md" : ""}`} key={i}>{v.name}</li>
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            {ads
                                .filter((el) => {
                                    if (sectionId === null) {
                                        return true;
                                    }
                                    return sectionId == el.sectionId;
                                })
                                .map((ad, i) => {
                                    return (<div key={i} className="p-6 bg-white border-b border-gray-200">
                                        <div className="grid grid-flow-col">
                                            <div className="col-span-8">
                                                <p>{ad.name} (Priority {ad.priority}): Runs from {new Date(ad.startingOn * 1000).toLocaleString('en-CA', { timeZone: 'EST' })} to {new Date(ad.endingOn * 1000).toLocaleString('en-CA', { timeZone: 'EST' })}</p>
                                            </div>
                                            <div className="col-span-4 text-right inline-block">
                                                <div data-ad-group={ad.id}>
                                                    <p className="inline-block">{sectionDictionary['sect' + ad.sectionId]}&nbsp;/&nbsp;</p>
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
                                        <div>
                                            <p>Tagline: <a style={{ color: "blue" }} target={"_blank"} href={ad.url}>{ad.tagLine}</a></p>
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

import React, { useEffect, useState, useRef } from 'react';
import Body from '../Components/Body';
import Input from '../Components/Input';
import Button from '../Components/Button';
import ValidationErrors from '@/Components/ValidationErrors';
import { useForm } from '@inertiajs/inertia-react';
import Label from '../Components/Label';
import { InertiaLink } from '@inertiajs/inertia-react';

export default function AdsUpdate(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        usingMediaId: 0,
        priority: 0,
        sectionId: 0,
        startingOn: "",
        endingOn: "",
        url: "",
        tagLine: "",
        id: 0,
    });

    const [mediaResults, setMediaResults] = useState([]);
    const [sectionResults, setSectionResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const mediaInputRef = useRef();
    const sectionInputRef = useRef();

    useEffect(() => {
        if (loading) {
            setData({
                name: props.ad.name,
                usingMediaId: props.ad.usingMediaId,
                priority: props.ad.priority,
                sectionId: props.ad.sectionId,
                startingOn: new Date(props.ad.startingOn * 1000).toISOString().split('T')[0],
                endingOn: new Date(props.ad.endingOn * 1000).toISOString().split('T')[0],
                url: props.ad.url,
                tagLine: props.ad.tagLine,
                id: props.ad.id,
            });
            setLoading(false)
        }
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
        console.log(data);
    };

    // Media search

    const mediaIdSearch = (name) => {
        if (name.trim().length === 0) {
            setMediaResults([]);
            return;
        }
        axios.get(route('searchMedia'), {
            params: {
                "name": name
            }
        })
            .then(res => {
                setMediaResults(res.data.results);
            })
            .catch(function (e) {
                setMediaResults([]);
                console.error(e);
            })
    }

    const updateMediaId = (e) => {
        let mediaId = e.target.dataset.mediaId;
        setData("usingMediaId", mediaId);
        mediaInputRef.current.value = "Using " + e.target.innerHTML + " (ID " + mediaId + ")";
        mediaInputRef.current.disabled = true;
        setMediaResults([]);
    }

    const mediaInputClicked = (e) => {
        mediaInputRef.current.value = "";
        mediaInputRef.current.disabled = false;
        setData("usingMediaId", "");
        setMediaResults([]);
    }

    // Section search

    const sectionIdSearch = (name) => {
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
        setData("sectionId", sectionId);
        sectionInputRef.current.value = "Using " + e.target.innerHTML + " (ID " + sectionId + ")";
        sectionInputRef.current.disabled = true;
        setSectionResults([]);
    }

    const sectionInputClicked = (e) => {
        sectionInputRef.current.value = "";
        sectionInputRef.current.disabled = false;
        setData("sectionId", "");
        setSectionResults([]);
    }

    const submit = (e) => {
        e.preventDefault();

        post(route('updateAd'));
    };

    return (
        <Body props={props} pageName={"ads"} title={"Update ad"} isLoading={false} children={(<>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        Please note that all times are in EST. If you set an ad to start on June 1 and end on June 30,
                        the ad will start at June 1, 12 AM EST and end on June 30, 12 AM EST.
                        <br />
                        In addition, if you leave the media/section ID blank, the value will not be updated.
                    </div>
                </div>
                <br />
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <ValidationErrors errors={errors} />
                        <form onSubmit={submit} autoComplete={"off"}>
                            <Label forInput="name" value="Name" />

                            <Input
                                type="text"
                                name="name"
                                className="mt-1 block w-full"
                                isFocused={true}
                                handleChange={onHandleChange}
                                value={data.name}
                            />
                            <br />
                            <Label forInput="url" value="URL" />

                            <Input
                                type="url"
                                name="url"
                                className="mt-1 block w-full"
                                isFocused={true}
                                handleChange={onHandleChange}
                                value={data.url}
                            />
                            <br />
                            <Label forInput="tagLine" value="Tagline (title to display)" />

                            <Input
                                type="text"
                                name="tagLine"
                                className="mt-1 block w-full"
                                isFocused={true}
                                handleChange={onHandleChange}
                                value={data.tagLine}
                            />
                            <br />
                            <Label forInput="priority" value="Priority" />
                            <Input
                                type="number"
                                name="priority"
                                min={0}
                                className="mt-1 block w-full"
                                isFocused={true}
                                handleChange={onHandleChange}
                                value={data.priority}
                            />
                            <br />
                            <Label forInput="usingMediaId" value="Media" />
                            <Input
                                type="text"
                                name="usingMediaId"
                                className="mt-1 block w-full disabled:opacity-75"
                                isFocused={true}
                                handleChange={
                                    (e) => {
                                        mediaIdSearch(e.target.value);
                                    }
                                }
                                handleOnClick={mediaInputClicked}
                                customRef={mediaInputRef}
                                autoComplete={"off"}
                                placeHolder={"Start typing to see suggestions..."}
                            />
                            <div style={{
                                position: "relative"
                            }}
                                className="rounded-md">
                                <ul z-index={3}
                                    style={{
                                        height: "100%",
                                        position: "absolute",
                                        top: "5px",
                                        left: 0,
                                    }}
                                    className="w-full text-center md:w-auto md:text-left rounded-md bg-gray-200"
                                >
                                    {mediaResults.length > 0 && mediaResults.map((v, i) => {
                                        return <li data-media-id={v.id} onClick={updateMediaId} className={`bg-gray-100 min-width-1/4 text-black shadow-md p-2 ${i == 0 ? "rounded-t-md" : ""} ${i == mediaResults.length - 1 ? "rounded-b-md" : ""}`} key={i}>{v.name} ({v.size} KB)</li>
                                    })}
                                </ul>
                            </div>
                            <br />
                            <Label forInput="sectionId" value="Section" />
                            <Input
                                type="text"
                                name="sectionId"
                                min={1}
                                className="mt-1 block w-full disabled:opacity-75"
                                isFocused={true}
                                handleChange={
                                    (e) => {
                                        sectionIdSearch(e.target.value);
                                    }
                                }
                                autoComplete={"off"}
                                customRef={sectionInputRef}
                                handleOnClick={sectionInputClicked}
                                placeHolder={"Start typing to see suggestions..."}
                            />
                            <div style={{
                                position: "relative"
                            }}
                                className="rounded-md">
                                <ul z-index={4}
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
                            <br />
                            <Label forInput="startingOn" value={"Starting on (previously " + new Date(props.ad.startingOn * 1000).toDateString() + " 12:00 AM EST)"} />
                            <Input
                                type="date"
                                name="startingOn"
                                className="mt-1 block w-full"
                                isFocused={true}
                                value={data.startingOn}
                                handleChange={onHandleChange}
                            />
                            <br />
                            <Label forInput="endingOn" value={"Ending on (previously " + new Date(props.ad.endingOn * 1000).toDateString() + " 12:00 AM EST)"} />
                            <Input
                                type="date"
                                name="endingOn"
                                className="mt-1 block w-full"
                                isFocused={true}
                                value={data.endingOn}
                                handleChange={onHandleChange}
                            />
                            <br />
                            <div className="md:inline-block w-full md:float-right">
                                <InertiaLink href={route('adsDashboard')} className="mb-2 md:mb-0 md:ml-1 w-full text-center inline-flex items-center px-4 py-2 bg-red-400 hover:bg-red-500 transition ease-in-out duration-150 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest md:float-right md:w-auto">Cancel</InertiaLink>
                                <Button className="w-full text-center md:float-right md:w-auto" processing={processing}>Update</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div></>)} />
    );
}

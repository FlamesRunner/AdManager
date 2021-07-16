import React, { useEffect, useState, useRef } from 'react';
import Body from '../Components/Body';
import Input from '../Components/Input';
import Button from '../Components/Button';
import ValidationErrors from '@/Components/ValidationErrors';
import { useForm } from '@inertiajs/inertia-react';
import Label from '../Components/Label';

export default function AdsCreate(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        usingMediaId: "",
        priority: 0,
        sectionId: "",
        startingOn: "",
        endingOn: "",
        url: "",
        tagLine: ""
    });
    const [mediaResults, setMediaResults] = useState([]);
    const [sectionResults, setSectionResults] = useState([]);
    const mediaInputRef = useRef();
    const sectionInputRef = useRef();

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

        post(route('createAd'));
    };

    return (
        <Body props={props} pageName={"ads"} title={"Create ad"} isLoading={false} children={(<>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        Please note that all times are in EST. If you set an ad to start on June 1 and end on June 30,
                        the ad will start at June 1, 12 AM EST and end on June 30, 12 AM EST.
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
                            />
                            <br />
                            <Label forInput="url" value="URL" />

                            <Input
                                type="url"
                                name="url"
                                className="mt-1 block w-full"
                                isFocused={true}
                                handleChange={onHandleChange}
                            />
                            <br />
                            <Label forInput="tagLine" value="Tagline (title to display)" />

                            <Input
                                type="text"
                                name="tagLine"
                                className="mt-1 block w-full"
                                isFocused={true}
                                handleChange={onHandleChange}
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
                            <Label forInput="startingOn" value="Starting on" />
                            <Input
                                type="date"
                                name="startingOn"
                                className="mt-1 block w-full"
                                isFocused={true}
                                max={data.endingOn}
                                handleChange={onHandleChange}
                            />
                            <br />
                            <Label forInput="endingOn" value="Ending on" />
                            <Input
                                type="date"
                                name="endingOn"
                                className="mt-1 block w-full"
                                isFocused={true}
                                min={data.startingOn}
                                handleChange={onHandleChange}
                            />
                            <br />
                            <Button className="w-full text-center md:float-right md:w-auto" processing={processing}>Create</Button>
                        </form>
                    </div>
                </div>
            </div></>)} />
    );
}

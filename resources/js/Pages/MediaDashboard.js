import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Body from '../Components/Body'
import { InertiaLink } from '@inertiajs/inertia-react';
import { useDropzone } from 'react-dropzone'

export default function MediaDashboard(props) {
    const [media, setMedia] = useState(null);
    const [action, setAction] = useState(null);
    const [statusMsg, setStatusMsg] = useState("");
    const onDrop = useCallback(acceptedFiles => {
        setAction("upload");
        // Do something with the files
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        let fd = new FormData();

        fd.append('image', acceptedFiles[0]);

        axios.post(route('storeMedia'), fd, config)
            .then((response) => {
                if (response.uploaded) {
                    setStatusMsg("Upload successful");
                } else {
                    setStatusMsg("Upload failed");
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setAction(null);
                setMedia(null);
            });
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    useEffect(() => {
        if (media === null && action === null) {
            axios.get(route('listMedia'))
                .then(res => {
                    setMedia(res.data.media);
                    console.log(res.data.media);
                })
                .catch(function (e) {
                    setMedia([]);
                    console.error(e);
                })
        }
    })

    if (media === null || action != null) return <Body props={props} pageName={"media"} children={<div></div>} isLoading={true} />;

    const deleteMedia = async (id) => {
        setAction("delete");
        axios.post(route("deleteMedia"), {
            "id": id
        })
            .then(function (res) {
                if (typeof res.data.msg !== 'undefined') {
                    alert(res.data.msg);
                }
            })
            .catch(function (e) {
            }).finally(() => {
                setMedia(null);
                setAction(null);
            });
    }

    const getMedia = (id) => {
        window.open(route('getMedia', { "id": id }), "_blank", "height=600,width=800");
    }

    return (
        <Body props={props} pageName={"media"} isLoading={false} children={(
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className={`overflow-hidden shadow-sm sm:rounded-lg p-6 border-2 + ${isDragActive ? "bg-green-100 border-gray-400" : "bg-white border-gray-200"}`}>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <p className="text-center">Drop here to upload {statusMsg}</p> :
                                    <p className="text-center cursor-pointer">Drag and drop your media here, or click to select files</p>
                            }
                        </div>
                    </div>
                    <br />
                    <div className="grid grid-flow-col auto-cols-fr px-2">
                        <div><p>Filename (size in kilobytes)</p></div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {media.map((m, i) => {
                            return (<div key={i} className="p-6 bg-white border-b border-gray-200">
                                <div className="grid grid-flow-col">
                                    <div className="col-span-8">
                                        <p>{m.name} ({m.size} KB)</p>
                                    </div>
                                    <div className="col-span-4 text-right inline-block">
                                        <div data-media-group={m.id}>
                                            <p className="text-red-500 inline-block cursor-pointer hover:underline" data-media-id={m.id} onClick={(e) => {
                                                deleteMedia(e.target.dataset.mediaId)
                                            }}>Delete</p>
                                            <p className="inline-block">&nbsp;/&nbsp;</p>
                                            <p className="inline-block cursor-pointer hover:underline" data-media-id={m.id} onClick={(e) => {
                                                getMedia(e.target.dataset.mediaId);
                                            }}>View</p>
                                        </div>
                                    </div>
                                </div>
                            </div>);
                        })}
                        {media.length === 0 && <div className="p-6 bg-white border-b border-gray-200"><p>No media found...</p></div>}
                    </div>
                </div>
            </div>)} />
    );
}

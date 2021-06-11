import React, { useEffect, useState } from 'react';
import Body from '../Components/Body';
import { InertiaLink } from '@inertiajs/inertia-react';
import axios from 'axios';
import Button from '../Components/Button';

export default function SectionsDashboard(props) {
    const [sections, setSections] = useState(null);
    const [action, setAction] = useState(null);
    const [formInput, setFormInput] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (sections === null && action === null) {
            axios.get('/sections/list')
                .then(res => {
                    setSections(res.data.sections);
                })
                .catch(function (e) {
                    setSections([]);
                    console.error(e);
                })
        }
    })

    const deleteSection = async (e) => {
        setAction("delete");
        axios.post("/sections/delete", {
            "id": e.target.dataset.sectionId
        })
            .catch(function (e) {
                console.error(e);
            }).finally(() => {
                setSections(null);
                setAction(null);
            });
    }

    const handleUpdateSection = async (children) => {
        for (let i = 0; i < children.length; i++) {
            if (children[i].classList.contains("hidden")) {
                children[i].classList.remove("hidden");
            } else {
                children[i].classList.add("hidden");
            }
        }
    }

    const updateSection = async (e) => {
        if (isUpdating) return;
        const p = e.target.parentElement.parentElement.children;
        setIsUpdating(true);
        setFormInput(null);
        handleUpdateSection(p);
    }

    const updateSectionBtn = async (e) => {
        if (formInput == null) {
            handleUpdateSection(e.target.parentElement.parentElement.children);
            setIsUpdating(false);
            return;
        }
        e.target.disabled = true;
        setAction("update");
        axios.post("/sections/update", {
            "id": e.target.parentElement.dataset.sectionGroupInput,
            "name": formInput
        })
            .then(res => {
                console.log(res);
            }).catch(function (e) {
                console.error(e);
            }).finally(() => {
                handleUpdateSection(e.target.parentElement.parentElement.children);
                setIsUpdating(false);
                setSections(null);
                setAction(null);
                e.target.disabled = false;
            });
    }

    if (sections === null || action != null) return <Body props={props} pageName={"sections"} children={<div></div>} isLoading={true} />;

    return (
        <Body props={props} pageName={"sections"} isLoading={false} children={(
            <>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="grid grid-flow-col auto-cols-fr px-2">
                            <div><p>Section Name</p></div>
                            <div className="text-right">
                                <InertiaLink href={route('createSectionPage')} className="text-sm text-gray-700 underline mb-4">
                                    Create section
                                </InertiaLink>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            {sections.map((section, i) => {
                                return (<div key={i} className="p-6 bg-white border-b border-gray-200">
                                    <div className="grid grid-flow-col">
                                        <div className="col-span-8">
                                            <p>{section.name}</p>
                                        </div>
                                        <div className="col-span-4 text-right inline-block">
                                            <div data-section-group-input={section.id} className="hidden flex float-right">
                                                <input
                                                    onKeyPress={e => {
                                                        if (e.key === 'Enter') {
                                                            e.target.nextSibling.click();
                                                        }
                                                    }}
                                                    onChange={(e) => setFormInput(e.target.value)} 
                                                    className="disabled:opacity-50 border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm flex" 
                                                    type="text" 
                                                    placeholder="New name..." 
                                                    defaultValue={section.name} 
                                                />
                                                <Button className="disabled:opacity-50 ml-2 flex h-auto" handleOnClick={(e) => {
                                                    updateSectionBtn(e);
                                                }}>Update</Button>
                                            </div>
                                            <div data-section-group={section.id}>
                                                <p className="text-red-500 inline-block cursor-pointer hover:underline" data-section-id={section.id} onClick={(e) => {
                                                    deleteSection(e)
                                                }}>Delete</p>
                                                <p className="inline-block">&nbsp;/&nbsp;</p>
                                                <p className="inline-block cursor-pointer hover:underline" data-section-id={section.id} onClick={(e) => {
                                                    updateSection(e)
                                                }}>Update</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>);
                            })}
                            {sections.length === 0 && <div className="p-6 bg-white border-b border-gray-200"><p>No sections found...</p></div>}
                        </div>
                    </div>
                </div>
            </>)} />
    );
}

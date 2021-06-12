import Authenticated from '@/Layouts/Authenticated';
import React from 'react';
import { useState } from 'react';

export default function Dashboard(props) {
    const [code, setCode] = useState("> Enter a section name");
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">Welcome back, {props.auth.user.name}!</div>
                    </div>
                </div>
                <br />
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-gray-200">Generate WordPress shortcode</div>
                        <input
                            type="text"
                            className="mt-1 block w-full disabled:opacity-75 px-6 py-2 focus:outline-none active:outline-none border-0 bg-gray-100"
                            onChange={
                                (e) => {
                                    if (e.target.value.length === 0) {
                                        setCode("> Enter a section name");
                                    } else {
                                        setCode(
                                            "> [varsity-plug section-name=`" + e.target.value + "`]"
                                        );
                                    }
                                }
                            }
                            autoComplete={"off"}
                            placeHolder={`Section name...`}

                        />
                        <pre className="bg-black text-green-200 py-2 px-6 overflow-x-scroll">{code}</pre>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

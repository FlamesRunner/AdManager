import React from 'react';
import Authenticated from '@/Layouts/Authenticated';

export default function Body({ props, pageName, title, children, isLoading = true }) {
    return <Authenticated
        auth={props.auth}
        errors={props.errors}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{title || "Manage " + pageName }</h2>}
    >
        {isLoading &&
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">Loading {pageName}...</div>
                    </div>
                </div>
            </div>}
        {!isLoading && children}
    </Authenticated>;
}
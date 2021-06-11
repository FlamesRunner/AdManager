import React, { useEffect, useState } from 'react';
import Body from '../Components/Body';
import Input from '../Components/Input';
import Button from '../Components/Button';
import ValidationErrors from '@/Components/ValidationErrors';
import { useForm } from '@inertiajs/inertia-react';
import Label from '../Components/Label';

export default function SectionsCreate(props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: ''
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('createSection'));
    };

    return (
        <Body props={props} pageName={"sections"} title={"Create section"} isLoading={false} children={(<>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <ValidationErrors errors={errors} />
                        <form onSubmit={submit}>
                            <Label forInput="name" value="Name" />

                            <Input
                                type="text"
                                name="name"
                                className="mt-1 block w-full"
                                isFocused={true}
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

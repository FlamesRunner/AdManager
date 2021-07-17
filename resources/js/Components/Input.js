import React, { useEffect, useRef } from 'react';

export default function Input({
    type = 'text',
    name,
    value,
    className,
    autoComplete,
    placeHolder,
    required,
    isFocused,
    handleChange,
    min,
    max,
    children = false,
    customRef = null,
    handleOnClick = (e) => {},
    onBlur
}) {
    const input = (customRef === null) ? useRef() : customRef;

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-start">
            <input
                type={type}
                name={name}
                value={value}
                className={
                    `border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm ` +
                    className
                }
                ref={input}
                autoComplete={autoComplete}
                placeholder={placeHolder}
                required={required}
                min={min}
                max={max}
                onBlur={onBlur}
                onClick={(e) => handleOnClick(e)}
                onChange={(e) => handleChange(e)}
            />
            {children}
        </div>
    );
}

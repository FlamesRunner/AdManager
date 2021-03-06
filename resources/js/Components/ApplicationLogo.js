import React from 'react';

export default function ApplicationLogo({ className, width=222.667, height=220 }) {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox="0 0 167 165"
          className={className}
        >
          <path d="M69.5.6C50 4.7 34.8 13 21.8 26.8 13.6 35.5 8 45 3.8 57.1 1.1 65.2.6 68.2.2 79.3c-.5 14.5.5 21.4 4.9 32.9 9.1 23.5 29 41.7 54.4 49.8 10.8 3.4 32.2 4 43.6 1.1 24.5-6.2 45.4-22.8 56.2-44.6 8.5-17.2 9.9-44.5 3.2-63.8-8.9-25.6-34-47.4-61.5-53.2C94.5.1 74.6-.4 69.5.6zM62 51.9c0 .5-.7 1.4-1.5 2.1-2.6 2.1-1.7 6 3.6 15.9C74.1 88.6 91.3 116 93 116c1.3 0 3.7-3.8 13-19.9 9.8-17.2 14-25.8 14-28.8 0-1.3-.7-4-1.6-6.2-1.3-3.3-2.5-4.3-8.2-6.9l-6.7-3 15.3-.1c8.3-.1 15.2.1 15.2.4 0 1-32.2 56.3-44.2 75.8-3.3 5.3-6.4 9.5-6.8 9.2-1.6-1-39.8-66.2-46.1-78.6-1.5-3.1-2.5-5.9-2.2-6.3 1-1 27.3-.7 27.3.3z" />
        </svg>
      )
}

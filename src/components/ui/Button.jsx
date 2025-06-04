import React from 'react'
import clsx from 'clsx'

const Button = ({
    children,
    onClick,
    className = '',
    gradientStart = 'from-gray-400',
    gradientEnd = 'to-gray-400',
    ...props
}) => {
    return (
        <button
            onClick={onClick}
            className={clsx('w-full bg-gradient-to-r cursor-pointer',
                gradientStart, gradientEnd,
                'hover:brightness-110 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl', className)}
            {...props}
        >
            {children}
        </button>
    )
}

export default Button

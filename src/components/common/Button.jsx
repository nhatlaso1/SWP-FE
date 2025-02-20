// src/components/common/Button.jsx
import React from 'react';
import './Button.css'; // CSS for Button

const Button = ({ onClick, children, type = 'button', className = '' }) => {
    return (
        <button className={`custom-button ${className}`} type={type} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
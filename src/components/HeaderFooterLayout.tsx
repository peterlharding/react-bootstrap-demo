import React from 'react';
import './HeaderFooterLayout.css';

interface LayoutProps {
	children: React.ReactNode
}

export const HeaderFooterLayout = ({children}: LayoutProps) => (
    <div className='header-footer-layout'>
        {children}
    </div>
);

HeaderFooterLayout.Header = ({children}: LayoutProps) => (
    <div className='header-footer-layout-header'>
        {children}
    </div>
);

HeaderFooterLayout.Body = ({children}: LayoutProps) => (
    <div className='header-footer-layout-body'>
        {children}
    </div>
);

HeaderFooterLayout.Footer = ({children}: LayoutProps) => (
    <div className='header-footer-layout-footer'>
        {children}
    </div>
);
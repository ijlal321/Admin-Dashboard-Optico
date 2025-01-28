"use client";
import React from 'react'

const NavigationData = [
    {
        title: 'Home',
        destination: "/dashboard"
    },
    {
        title: "Add new Stock",
        subPages: [
            {
                title: 'Frame',
                destination: "/manage-frames/new"
            },
            {
                title: 'Sunglass',
                destination: "/manage-sunglass/new"
            },
            {
                title: 'Reading Glass',
                destination: "/manage-reading-glass/new"
            },
            {
                title: 'Prescription lens',
                destination: "/manage-prescription-lens/new"
            },
            {
                title: 'Contact lens',
                destination: "/manage-contact-lens/new"
            }
        ]
    },
    {
        title: 'Manage Stock',
        subPages: [
            {
                title: 'Frame',
                destination: "/manage-frames"
            },
            {
                title: 'Sunglass',
                destination: "/manage-sunglass"
            },
            {
                title: 'Reading Glass',
                destination: "/manage-reading-glass"
            },
            {
                title: 'Prescription lens',
                destination: "/manage-prescription-lens"
            },
            {
                title: 'Contact lens',
                destination: "/manage-contact-lens"
            }
        ]
    },
    {
        title: 'Customers and Prescriptions',
        destination: "/manage-customers"
    },
    {
        title: 'Shipments',
        destination: "/manage-shipments"
    },
    {
        title: 'Orders',
        subPages: [
            {
                title: 'Add new Order',
                destination: "/manage-orders/add"
            },
            {
                title: 'Manage Orders',
                destination: "/manage-orders"
            }
        ]
    }
];

const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function TopHeader() {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#333', color: '#fff', alignItems: 'center' }}>
            <a href="/" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none', fontSize: "24" }} >Optico</a>
            <a onClick={logout} href="#" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>Logout</a>
        </div>
    )
}

export default TopHeader
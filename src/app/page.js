"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavigationCard from '@/components/helpers/NavigationCard';
import { useEffect, useState } from 'react';
import { getRole } from '@/utlis/auth';
import withProtectedRoute from '@/hoc/withProtectedRoute';  // Import the HOC


const AdminNavigationData = [
  {
    title: 'Fast Options',
    subPages: [
      {
        title: 'Book New Order',
        destination: "manage-orders/new"
      },
      {
        title: 'Add new Prescription',
        destination: "/manage-customers"
      },
    ]
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
        destination: "manage-orders/new"
      },
      {
        title: 'Manage Orders',
        destination: "/manage-orders"
      }
    ]
  }
];

const EmployeeNavigationData = [
  {
    title: 'Fast Options',
    subPages: [
      {
        title: 'Book New Order',
        destination: "/manage-customers"
      },
      {
        title: 'Add new Prescription',
        destination: "/manage-customers"
      },
    ]
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
    ]
  },
  {
    title: 'Customers and Prescriptions',
    destination: "/manage-customers"
  },
  {
    title: 'Orders',
    subPages: [
      {
        title: 'Add new Order',
        destination: "/manage-orders/new"
      },
      {
        title: 'Manage Orders',
        destination: "/manage-orders"
      }
    ]
  }
];



const Home = ()=> {
  const [NavigationData, setNavigationData] = useState(null);


  useEffect(() => {
    const role = getRole();
    if (role == 'admin') {
      setNavigationData(AdminNavigationData);
    }
    else if (role == 'employee') {
      setNavigationData(EmployeeNavigationData);
    }
    else {
      setNavigationData([]);
    }
  }, []);

  if (!NavigationData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container p-5">

      {
        NavigationData.map((nav, index) => {
          return (
            <div key={index}>
              <h1 className='my-3' style={{ fontSize: "2rem" }}>{nav.title}</h1>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                {nav.subPages ? nav.subPages.map((subPage, subIndex) => {
                  return (
                    <div className="col-md-3" key={subIndex}>
                      <NavigationCard title={subPage.title} destination={subPage.destination} />
                    </div>
                  )
                })
                  :
                  <div className="col-md-3">
                    <NavigationCard title={nav.title} destination={nav.destination} />
                  </div>
                }
              </div>

              <hr className='m-5' />
            </div>
          );
        })
      }
    </div>
  )
}

export default withProtectedRoute(Home, 'any'); 


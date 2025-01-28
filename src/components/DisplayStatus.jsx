// components/DisplayStatus.js
import React from 'react';
import { CheckCircle, Loader, XCircle, AlertTriangle, Save, Clock } from 'lucide-react';

const statusTypes = {
  idle: {
    message: 'Ready',
    icon: <CheckCircle />,
    className: 'alert-secondary',
  },
  saving: {
    message: 'Saving...',
    icon: <Save />,
    className: 'alert-info',
  },
  error: {
    message: 'An error occurred',
    icon: <XCircle />,
    className: 'alert-danger',
  },
  loading: {
    message: 'Loading...',
    icon: <Loader className="animate-spin" />,
    className: 'alert-warning',
  },
  warning: {
    message: 'Warning!',
    icon: <AlertTriangle />,
    className: 'alert-warning',
  },
  none: {
    message: '',
    icon: null,
    className: '',
  },
};

const DisplayStatus = ({ status, message, isOverlayVisible=false }) => {
  if (status === 'none') return null;

  const { icon, className } = statusTypes[status] || statusTypes.idle;
  const displayMessage = message || statusTypes[status]?.message;

  return (
    <>
      {/* Fullscreen Overlay */}
      {isOverlayVisible && (
        <div
          className="position-fixed top-0 start-0 end-0 bottom-0 bg-dark opacity-50"
          style={{ zIndex: 1040 }}
        ></div>
      )}

      {/* Status Message */}
      <div
        className="position-fixed bottom-0 start-0 end-0 mb-5 d-flex justify-content-center"
        style={{ zIndex: 1050}}
      >
        <div className={`d-flex alert ${className} mb-0`} role="alert">
          <span className="me-2">{icon}</span>
          {displayMessage}
        </div>
      </div>
    </>
  );
};

export default DisplayStatus;

'use client';

function NavigationCard({ title, destination }) {
    return (
    <div className="card shadow-sm " style={{ cursor: 'pointer', minHeight:"100px" }} onClick={() => window.location.href = destination}>
        <div className="card-body d-flex align-items-center justify-content-center">
        <h5 className="card-title" style={{fontSize:"1.1rem"}}>{title}</h5>
        </div>
        <style jsx>{`
        .card:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transform: scale(1.05);
            transition: all 0.3s ease-in-out;
        }
        `}</style>
    </div>
    )
}

export default NavigationCard
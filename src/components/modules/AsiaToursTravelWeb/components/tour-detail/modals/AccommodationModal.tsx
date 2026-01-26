
import React, { useState } from 'react';
import { Modal } from '../../common/Modal';

// Types (should ideally be shared or inferred from Payload types)
export interface AccommodationOption {
    hotel_name: string;
    hotel_grade: 'Economy' | 'Deluxe' | 'Luxury';
    star_rating?: number;
    review_count?: number;
    trip_advisor_url?: string;
    image?: any; // Media object or ID
    description?: string;
}

export interface AccommodationDay {
    day_title: string;
    options: AccommodationOption[];
}

interface AccommodationModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: { items: AccommodationDay[] };
}

export const AccommodationModal: React.FC<AccommodationModalProps> = ({ isOpen, onClose, data }) => {
    const [filter, setFilter] = useState<'All' | 'Economy' | 'Deluxe' | 'Luxury'>('All');

    if (!data?.items) return null;

    // Filter logic: In user's example, filtering usually hides options not matching.
    // However, the structure is Day -> Options.
    // If we filter "Luxury", do we show days that have Luxury options?
    // Yes, for each day, show only Luxury options.

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Accommodation Details" className="modal-accommodation">
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                {['All', 'Economy', 'Deluxe', 'Luxury'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        style={{
                            padding: '8px 16px',
                            border: 'none',
                            background: filter === f ? '#00B8D9' : '#f0f0f0',
                            color: filter === f ? 'white' : '#333',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 500
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {data.items.map((day, dayIndex) => {
                    const filteredOptions = day.options?.filter(opt => filter === 'All' || opt.hotel_grade === filter);
                    
                    if (!filteredOptions || filteredOptions.length === 0) return null;

                    return (
                        <div key={dayIndex} className="day-group">
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '15px', borderLeft: '4px solid #00B8D9', paddingLeft: '10px' }}>
                                {day.day_title}
                            </h4>
                            <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                                {filteredOptions.map((hotel, hIndex) => (
                                    <div key={hIndex} className="hotel-card" style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                                        {hotel.image && (
                                            <div style={{ height: '180px', overflow: 'hidden' }}>
                                                {/* Assuming image is object with url or string url if resolved differently. 
                                                    Payload returned objects usually have url. If ID, we can't render easily without fetch.
                                                    We assume populated data.
                                                 */}
                                                <img 
                                                    src={typeof hotel.image === 'string' ? hotel.image : hotel.image?.url} 
                                                    alt={hotel.hotel_name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        )}
                                        <div style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '5px' }}>
                                                <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{hotel.hotel_name}</h5>
                                                {hotel.star_rating && (
                                                    <span style={{ color: '#FFC107', fontSize: '0.9rem' }}>
                                                        {'★'.repeat(hotel.star_rating)}
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
                                                {hotel.hotel_grade} Class
                                                {hotel.review_count && ` • ${hotel.review_count} reviews`}
                                            </div>
                                            {hotel.description && (
                                                <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {hotel.description}
                                                </p>
                                            )}
                                            {hotel.trip_advisor_url && (
                                                <a 
                                                    href={hotel.trip_advisor_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ fontSize: '0.8rem', color: '#00B8D9', textDecoration: 'none' }}
                                                >
                                                    View on TripAdvisor &rarr;
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
};

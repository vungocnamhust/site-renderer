
import React from 'react';
import { Modal } from '../../common/Modal';

interface Experience {
    title: string;
    description: string;
    image?: any; // Media
    slug: string;
    location?: string;
}

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: { items: Experience[] };
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({ isOpen, onClose, data }) => {
    if (!data?.items) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Travel Experiences" className="modal-experiences">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {data.items.map((exp, index) => (
                    <div key={index} className="experience-card" style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                         {exp.image && (
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img 
                                    src={typeof exp.image === 'string' ? exp.image : exp.image?.url} 
                                    alt={exp.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                />
                            </div>
                        )}
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>
                                    {exp.location}
                                </span>
                                <h4 style={{ margin: '5px 0 0', fontSize: '1.1rem', fontWeight: 600 }}>{exp.title}</h4>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6', flex: 1 }}>
                                {exp.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

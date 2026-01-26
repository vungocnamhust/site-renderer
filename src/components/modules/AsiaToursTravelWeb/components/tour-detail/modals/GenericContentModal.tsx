
import React from 'react';
import { Modal } from '../../common/Modal';

interface GenericContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any; // RichText data
}

const renderRichText = (node: any, index: number): React.ReactNode => {
    if (!node) return null;

    if (node.text) {
        let text = node.text;
        if (node.bold) text = <strong>{text}</strong>;
        if (node.italic) text = <em>{text}</em>;
        if (node.underline) text = <u>{text}</u>;
        return <span key={index}>{text}</span>;
    }

    switch (node.type) {
        case 'root':
            return <div key={index} className="rich-text-content">{node.children?.map((child: any, i: number) => renderRichText(child, i))}</div>;
        case 'heading':
            const tag = (node.tag || 'h3') as string;
            return React.createElement(tag, { key: index, style: { marginTop: '20px', marginBottom: '10px' } }, node.children?.map((child: any, i: number) => renderRichText(child, i)));
        case 'paragraph':
            return <p key={index} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{node.children?.map((child: any, i: number) => renderRichText(child, i))}</p>;
        case 'list':
            const listTag = node.listType === 'number' ? 'ol' : 'ul';
            return React.createElement(listTag, { key: index, style: { paddingLeft: '20px', marginBottom: '15px' } }, node.children?.map((child: any, i: number) => renderRichText(child, i)));
        case 'listitem':
            return <li key={index} style={{ marginBottom: '5px' }}>{node.children?.map((child: any, i: number) => renderRichText(child, i))}</li>;
        default:
            return node.children?.map((child: any, i: number) => renderRichText(child, i));
    }
};

export const GenericContentModal: React.FC<GenericContentModalProps> = ({ isOpen, onClose, title, data }) => {
    // Navigate to root if needed
    const content = data?.content?.root || data?.description?.root || data?.root || data;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="generic-content" style={{ fontSize: '1rem', color: '#444' }}>
                {content ? renderRichText(content, 0) : <p>No details available.</p>}
            </div>
        </Modal>
    );
};

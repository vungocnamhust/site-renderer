import React from 'react'

interface BlogContentProps {
  content?: any // RichText JSON (Lexical format)
}

/**
 * Renders Lexical RichText JSON with support for:
 * - Paragraphs, Headings, Lists
 * - Bold, Italic, Underline text formatting
 * - Upload nodes (images)
 * - Links
 */
const renderRichText = (node: any, index: number): React.ReactNode => {
  if (!node) return null

  // Handle text nodes (with formatting)
  if (node.text !== undefined) {
    let text: React.ReactNode = node.text
    if (node.bold) text = <strong key={`bold-${index}`}>{text}</strong>
    if (node.italic) text = <em key={`italic-${index}`}>{text}</em>
    if (node.underline) text = <u key={`underline-${index}`}>{text}</u>
    if (node.strikethrough) text = <s key={`strike-${index}`}>{text}</s>
    return <React.Fragment key={index}>{text}</React.Fragment>
  }

  // Handle different node types
  switch (node.type) {
    case 'root':
      return (
        <div key={index}>
          {node.children?.map((child: any, i: number) => renderRichText(child, i))}
        </div>
      )

    case 'paragraph':
      return (
        <p key={index}>
          {node.children?.map((child: any, i: number) => renderRichText(child, i))}
        </p>
      )

    case 'heading':
      const HeadingTag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
      return React.createElement(
        HeadingTag,
        { key: index },
        node.children?.map((child: any, i: number) => renderRichText(child, i))
      )

    case 'list':
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      return React.createElement(
        ListTag,
        { key: index },
        node.children?.map((child: any, i: number) => renderRichText(child, i))
      )

    case 'listitem':
      return (
        <li key={index}>
          {node.children?.map((child: any, i: number) => renderRichText(child, i))}
        </li>
      )

    case 'link':
    case 'autolink':
      const href = node.fields?.url || node.url || '#'
      const target = node.fields?.newTab ? '_blank' : undefined
      return (
        <a key={index} href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
          {node.children?.map((child: any, i: number) => renderRichText(child, i))}
        </a>
      )

    case 'quote':
      return (
        <blockquote key={index}>
          {node.children?.map((child: any, i: number) => renderRichText(child, i))}
        </blockquote>
      )

    // Handle upload/image nodes from Lexical UploadFeature
    case 'upload':
      // Debug: Log the entire upload node structure
      console.log('[BlogContent] Upload node:', JSON.stringify(node, null, 2))
      
      // In Lexical, upload nodes may have `value` (populated) or just ID
      const media = node.value
      if (!media) {
        console.log('[BlogContent] Upload node has no value, skipping')
        return null
      }
      
      const imageUrl = media.url || ''
      const alt = media.alt || media.filename || ''
      const caption = media.caption
      
      console.log('[BlogContent] Rendering image:', { imageUrl, alt, caption })
      
      return (
        <figure key={index} className="blog-image" style={{ margin: '20px 0' }}>
          <img 
            src={imageUrl} 
            alt={alt} 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          {caption && (
            <figcaption className="caption" style={{ textAlign: 'center', fontStyle: 'italic', marginTop: '10px' }}>
              {caption}
            </figcaption>
          )}
        </figure>
      )

    default:
      // For any unknown node types, recursively render children
      if (node.children) {
        return (
          <React.Fragment key={index}>
            {node.children.map((child: any, i: number) => renderRichText(child, i))}
          </React.Fragment>
        )
      }
      return null
  }
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="paragraph">
      {content?.root ? (
        // Render Lexical RichText JSON
        renderRichText(content.root, 0)
      ) : (
        // Fallback for empty content
        <p>No content available.</p>
      )}
    </div>
  )
}


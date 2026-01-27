
/**
 * Convert Lexical Rich Text JSON to plain text string
 * Recursive function to traverse nodes
 */
export function lexicalToString(node: any): string {
    if (!node) return ''
    
    // If text node
    if (node.text) {
        return node.text
    }
    
    // If node has children, traverse them
    if (node.children && Array.isArray(node.children)) {
        return node.children.map((child: any) => lexicalToString(child)).join(' ')
    }
    
    // If root
    if (node.root) {
        return lexicalToString(node.root)
    }
    
    return ''
}

/**
 * Migration Script: cleanseExperienceContent.ts
 * 
 * This script cleanses the `content` field of the `Experiences` collection.
 * The `parseEditorState` error occurs because the stored data contains
 * node types that are not registered in the current Lexical editor.
 * 
 * This script sets the `content` field to an empty initial state for
 * experiences that have corrupted data. Run this manually to fix existing records.
 * 
 * Usage:
 *   npx tsx src/migrations/cleanseExperienceContent.ts
 */

import 'dotenv/config' // Load .env variables
import { getPayload } from 'payload'
import configPromise from '../payload.config'

let changesMade = 0

function fixNodesRecursively(node: any): any {
  if (Array.isArray(node)) {
    return node.map(n => fixNodesRecursively(n))
  }
  
  if (node && typeof node === 'object') {
    // Fix text nodes that are missing type or have undefined type (but have 'text' property)
    if ('text' in node) {
      console.log(`    -> Node with text found: type = "${node.type}", hasType = ${'type' in node}`)
    }
    if ('text' in node && (!node.type || node.type === undefined)) {
      node.type = 'text'
      changesMade++
    }
    
    // Recursively fix children
    if (node.children) {
      node.children = fixNodesRecursively(node.children)
    }
    
    return node
  }
  
  return node
}

function resetChangeCounter() {
  changesMade = 0
}

async function run() {
  console.log('Starting Experience content cleanse migration...')
  
  const payload = await getPayload({ config: configPromise })
  
  try {
    // Fetch all experiences
    const { docs: experiences } = await payload.find({
      collection: 'experiences',
      limit: 500, // Adjust as needed
      depth: 0,
    })

    console.log(`Found ${experiences.length} experiences to check.`)
    
    let fixed = 0
    
    for (const exp of experiences) {
      const content = exp.content as any
      
      if (!content || !content.root) {
        continue
      }
      
      // Create a deep copy to modify
      const originalStr = JSON.stringify(content)
      console.log(`\n[${exp.id}] ${exp.title}`)
      
      // Clone the content
      const cloned = JSON.parse(originalStr)
      resetChangeCounter()
      
      // Apply fix to root
      fixNodesRecursively(cloned.root)
      
      console.log(`  Changes made: ${changesMade}`)
      
      // If the content changed, update it
      if (changesMade > 0) {
        console.log(`  -> Updating record...`)
        
        await payload.update({
          collection: 'experiences',
          id: exp.id,
          data: {
            content: cloned,
          }
        })
        
        fixed++
      }
    }
    
    console.log(`Migration complete. Fixed ${fixed} experiences.`)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

run()

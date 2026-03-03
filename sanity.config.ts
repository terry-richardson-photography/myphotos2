'use client'

/**
 * This configuration is used for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// API config
import { apiVersion, dataset, projectId } from './sanity/env'

// Schema + structure
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({ structure }),

    // Vision is for querying with GROQ from inside the Studio
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
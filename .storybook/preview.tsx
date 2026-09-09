import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'todo' },
  },
}

export default preview

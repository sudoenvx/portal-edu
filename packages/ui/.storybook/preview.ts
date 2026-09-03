import type { Preview } from '@storybook/react'
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'dark', value: '#0f1117' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
}

export default preview

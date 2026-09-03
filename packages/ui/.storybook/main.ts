import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  
  async viteFinal(config) {
    // Inject the Tailwind v4 Vite plugin
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss() as any);
    
    return config;
  },
}

export default config

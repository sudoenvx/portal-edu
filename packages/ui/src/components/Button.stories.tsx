import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../components/Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary Button' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary Button' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost Button' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
}

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving...' },
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
}

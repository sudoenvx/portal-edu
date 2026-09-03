import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../components/Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'info'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: 'Default' } }
export const Success: Story = { args: { variant: 'success', children: 'Active' } }
export const Warning: Story = { args: { variant: 'warning', children: 'Draft' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Archived' } }
export const Info: Story = { args: { variant: 'info', children: 'New' } }

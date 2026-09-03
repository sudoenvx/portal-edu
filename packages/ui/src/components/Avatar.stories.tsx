import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from '../components/Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithName: Story = { args: { name: 'Ahmed Hassan', size: 'md' } }
export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/150?img=3', alt: 'User avatar', size: 'md' },
}
export const ExtraLarge: Story = { args: { name: 'Sara Al-Rashid', size: 'xl' } }
export const Small: Story = { args: { name: 'TM', size: 'sm' } }

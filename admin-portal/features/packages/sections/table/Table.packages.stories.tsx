import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { TablePackages } from './Table.packages';

const withQueryClient: Decorator = (Story) => (
  <QueryClientProvider client={new QueryClient()}>
    <Story />
  </QueryClientProvider>
);

const meta: Meta<typeof TablePackages> = {
  title: 'Features/Packages/TablePackages',
  component: TablePackages,
  tags: ['autodocs'],
  decorators: [withQueryClient],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof TablePackages>;

export const Default: Story = {};

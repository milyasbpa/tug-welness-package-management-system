import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { Button } from '@/core/components/button';
import { usePackagesStore } from '@/features/packages/store/packages.store';

import { FormModalPackages } from './FormModal.packages';

const withQueryClient: Decorator = (Story) => (
  <QueryClientProvider client={new QueryClient()}>
    <Story />
  </QueryClientProvider>
);

const mockPackage: PackageResponseDto = {
  id: '1a2b3c4d-0000-0000-0000-000000000001',
  name: 'Deep Tissue Massage',
  description: 'A therapeutic massage that targets deep muscle layers.',
  price: 120,
  durationMinutes: 60,
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T10:00:00.000Z',
};

function CreateDemo() {
  const openCreateModal = usePackagesStore((s) => s.openCreateModal);
  return (
    <div className="flex h-screen items-center justify-center">
      <Button variant="primary" onClick={() => openCreateModal()}>
        Add Package
      </Button>
      <FormModalPackages />
    </div>
  );
}

function EditDemo() {
  const openEditModal = usePackagesStore((s) => s.openEditModal);
  return (
    <div className="flex h-screen items-center justify-center">
      <Button variant="outline" onClick={() => openEditModal(mockPackage)}>
        Edit Package
      </Button>
      <FormModalPackages />
    </div>
  );
}

const meta: Meta<typeof FormModalPackages> = {
  title: 'Features/Packages/FormModalPackages',
  component: FormModalPackages,
  tags: ['autodocs'],
  decorators: [withQueryClient],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FormModalPackages>;

/** Create mode — blank form for adding a new package. */
export const CreateMode: Story = {
  render: () => <CreateDemo />,
};

/** Edit mode — form pre-filled with the selected package data. */
export const EditMode: Story = {
  render: () => <EditDemo />,
};

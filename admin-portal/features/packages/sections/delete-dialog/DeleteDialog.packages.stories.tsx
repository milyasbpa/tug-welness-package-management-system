import type { Decorator, Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import type { PackageResponseDto } from '@/core/api/generated/nestjsStarter.schemas';
import { Button } from '@/core/components/button/Button';
import { usePackagesStore } from '@/features/packages/store/packages.store';

import { DeleteDialogPackages } from './DeleteDialog.packages';

const withQueryClient: Decorator = (Story) => (
  <QueryClientProvider client={new QueryClient()}>
    <Story />
  </QueryClientProvider>
);

function DeleteDemo({ pkg }: { pkg: PackageResponseDto }) {
  const openDeleteDialog = usePackagesStore((s) => s.openDeleteDialog);
  return (
    <div className="flex h-screen items-center justify-center">
      <Button variant="destructive" onClick={() => openDeleteDialog(pkg)}>
        Delete Package
      </Button>
      <DeleteDialogPackages />
    </div>
  );
}

const meta: Meta<typeof DeleteDialogPackages> = {
  title: 'Features/Packages/DeleteDialogPackages',
  component: DeleteDialogPackages,
  tags: ['autodocs'],
  decorators: [withQueryClient],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof DeleteDialogPackages>;

export const Default: Story = {
  render: () => (
    <DeleteDemo
      pkg={{
        id: '1a2b3c4d-0000-0000-0000-000000000001',
        name: 'Deep Tissue Massage',
        description: 'A therapeutic massage that targets deep muscle layers.',
        price: 120,
        durationMinutes: 60,
        createdAt: '2025-01-15T10:00:00.000Z',
        updatedAt: '2025-01-15T10:00:00.000Z',
      }}
    />
  ),
};

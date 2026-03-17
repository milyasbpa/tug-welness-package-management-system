'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  getAdminPackagesControllerFindAllV1QueryKey,
  useAdminPackagesControllerRemoveV1,
} from '@/core/api/generated/admin-packages/admin-packages';
import { handleApiError } from '@/core/lib/errors';
import { PACKAGES_INFINITE_QUERY_KEY } from '@/features/packages/react-query/use-admin-packages-infinite';
import { usePackagesStore } from '@/features/packages/store/packages.store';

export function useDeletePackage() {
  const t = useTranslations('packages');
  const queryClient = useQueryClient();
  const closeDeleteDialog = usePackagesStore((s) => s.closeDeleteDialog);

  return useAdminPackagesControllerRemoveV1({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAdminPackagesControllerFindAllV1QueryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: [PACKAGES_INFINITE_QUERY_KEY],
        });
        toast.success(t('toast.deleted'));
        closeDeleteDialog();
      },
      onError: (error) => {
        toast.error(handleApiError(error).message);
      },
    },
  });
}

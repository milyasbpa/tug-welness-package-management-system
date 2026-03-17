'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import {
  getAdminPackagesControllerFindAllV1QueryKey,
  useAdminPackagesControllerUpdateV1,
} from '@/core/api/generated/admin-packages/admin-packages';
import { handleApiError } from '@/core/lib/errors';
import { PACKAGES_INFINITE_QUERY_KEY } from '@/features/packages/react-query/use-admin-packages-infinite';
import { usePackagesStore } from '@/features/packages/store/packages.store';

export function useUpdatePackage() {
  const t = useTranslations('packages');
  const queryClient = useQueryClient();
  const closeModal = usePackagesStore((s) => s.closeModal);

  return useAdminPackagesControllerUpdateV1({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getAdminPackagesControllerFindAllV1QueryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: [PACKAGES_INFINITE_QUERY_KEY],
        });
        toast.success(t('toast.updated'));
        closeModal();
      },
      onError: (error) => {
        toast.error(handleApiError(error).message);
      },
    },
  });
}

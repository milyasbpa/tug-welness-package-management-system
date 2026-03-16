import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { userEvent, within } from 'storybook/test';

import { Button } from '@/core/components/button';
import { Input } from '@/core/components/input';

import { FormLogin } from './Form.login';

const meta: Meta<typeof FormLogin> = {
  title: 'Features/Login/FormLogin',
  component: FormLogin,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <div className="w-sm p-8">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FormLogin>;

/** Default state — empty form ready for input */
export const Default: Story = {};

/** Loading state — shown after form submit while awaiting API response (Step 5).
 *  Uses a story-only wrapper to simulate isPending = true visually.
 */
export const Loading: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access the admin portal
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email-loading"
            className="text-foreground text-sm leading-none font-medium"
          >
            Email
          </label>
          <Input
            id="email-loading"
            type="email"
            placeholder="admin@example.com"
            value="admin@example.com"
            disabled
            readOnly
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password-loading"
            className="text-foreground text-sm leading-none font-medium"
          >
            Password
          </label>
          <Input
            id="password-loading"
            type="password"
            placeholder="••••••••"
            value="password123"
            disabled
            readOnly
          />
        </div>
        <Button
          type="submit"
          variant="default"
          size="xl"
          className="w-full"
          disabled
          aria-label="Signing in..."
        >
          <Loader2 className="animate-spin" />
          Signing in...
        </Button>
      </div>
    </div>
  ),
};

/** Validation error state — triggered by submitting the form with invalid values.
 *  Uses a play function to fill invalid data and submit.
 */
export const WithValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByRole('textbox', { name: /email/i });
    const passwordInput = canvas.getByLabelText(/password/i);
    const submitButton = canvas.getByRole('button', { name: /sign in/i });

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'not-an-email');

    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'short');

    await userEvent.click(submitButton);
  },
};

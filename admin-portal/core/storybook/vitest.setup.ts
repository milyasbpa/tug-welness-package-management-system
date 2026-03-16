import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import { beforeAll } from 'vitest';

import * as projectAnnotations from './preview';

// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// Required: initializes vitest's internal expect state before any story tests run
beforeAll(project.beforeAll);

import * as migration_20260130_044832_seed_service_types from './20260130_044832_seed_service_types';
import * as migration_cleanseExperienceContent from './cleanseExperienceContent';

export const migrations = [
  {
    up: migration_20260130_044832_seed_service_types.up,
    down: migration_20260130_044832_seed_service_types.down,
    name: '20260130_044832_seed_service_types',
  },
  {
    up: migration_cleanseExperienceContent.up,
    down: migration_cleanseExperienceContent.down,
    name: 'cleanseExperienceContent'
  },
];

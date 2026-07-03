import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(process.cwd(), 'src/routes/(user)/user-settings/UserSettingsList.svelte'), 'utf8');

describe('UserSettingsList demo new-feature highlight', () => {
  it('marks user groups as a demo new-feature highlight', () => {
    expect(source).toContain('key="user-groups"');
    expect(source).toContain("class={authManager.isDemo ? 'demo-new-feature-glow' : ''}");
  });
});

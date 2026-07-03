import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(process.cwd(), 'src/routes/admin/system-settings/+page.svelte'), 'utf8');

describe('System settings demo new-feature highlight', () => {
  it('marks classification settings as a demo new-feature highlight', () => {
    expect(source).toContain("const demoNewFeatureSettings = new Set(['classification', 'memories']);");
    expect(source).toContain("authManager.isDemo && demoNewFeatureSettings.has(key) ? 'demo-new-feature-glow' : ''");
  });

  it('marks memories settings as a demo new-feature highlight', () => {
    expect(source).toContain("const demoNewFeatureSettings = new Set(['classification', 'memories']);");
  });
});

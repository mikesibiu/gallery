import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(
  join(process.cwd(), 'src/lib/components/shared-components/settings/SettingAccordion.svelte'),
  'utf8',
);

describe('SettingAccordion class forwarding', () => {
  it('forwards custom classes to the accordion container', () => {
    expect(source).toContain('class?: string');
    expect(source).toContain('className');
    expect(source).toContain('{className}');
  });
});

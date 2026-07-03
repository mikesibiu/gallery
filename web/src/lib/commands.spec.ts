import { beforeEach, describe, expect, it, vi } from 'vitest';
import { goto } from '$app/navigation';
import { getPagesProvider } from './commands';

const mockUser = vi.hoisted(() => ({
  current: { id: 'demo-user', isAdmin: false } as { id: string; isAdmin: boolean } | null,
  isDemo: true,
}));

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/state', () => ({ page: { url: new URL('https://gallery.test/photos') } }));
vi.mock('$lib/utils', () => ({ copyToClipboard: vi.fn() }));
vi.mock('$lib/managers/auth-manager.svelte', () => ({
  authManager: {
    get authenticated() {
      return mockUser.current !== null;
    },
    get user() {
      return mockUser.current;
    },
    get canPreviewAdmin() {
      return !!mockUser.current && (mockUser.current.isAdmin || mockUser.isDemo);
    },
  },
}));
vi.mock('@immich/ui', () => ({
  defaultProvider: vi.fn((provider) => provider),
  screencastManager: { toggle: vi.fn() },
  themeManager: { prefersDark: false, setPreference: vi.fn(), toggle: vi.fn() },
  ThemePreference: { System: 'system' },
}));

describe('getPagesProvider admin preview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.current = { id: 'demo-user', isAdmin: false };
    mockUser.isDemo = true;
  });

  it('shows admin pages for demo preview users without making them admins', () => {
    const provider = getPagesProvider(String) as unknown as {
      actions: Array<{ title: string; $if?: () => boolean }>;
    };
    const systemSettings = provider.actions.find((action) => action.title === 'admin.system_settings');

    expect(mockUser.current?.isAdmin).toBe(false);
    expect(systemSettings?.$if?.()).toBe(true);
  });

  it('still hides admin pages from normal non-admin users', () => {
    mockUser.isDemo = false;
    const provider = getPagesProvider(String) as unknown as {
      actions: Array<{ title: string; $if?: () => boolean }>;
    };

    // The command palette also lists user/utility pages (visible to any authenticated user);
    // scope the assertion to the admin-only entries, which must stay hidden without preview.
    const adminTitles = [
      'admin.user_management',
      'admin.system_settings',
      'admin.queues',
      'external_libraries',
      'server_stats',
    ];
    const adminActions = provider.actions.filter((action) => adminTitles.includes(action.title));

    expect(adminActions).toHaveLength(adminTitles.length);
    expect(adminActions.every((action) => action.$if?.() === false)).toBe(true);
  });

  it('navigates admin settings through the existing action', () => {
    const provider = getPagesProvider(String) as unknown as {
      actions: Array<{ title: string; onAction: () => void }>;
    };

    provider.actions.find((action) => action.title === 'admin.system_settings')?.onAction();

    expect(goto).toHaveBeenCalledWith('/admin/system-settings');
  });
});

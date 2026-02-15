module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // Category-level: warn only (CI 환경 한계)
        'categories:performance': ['warn', { minScore: 0.5 }],
        'categories:accessibility': ['warn', { minScore: 0.8 }],
        'categories:best-practices': ['warn', { minScore: 0.7 }],
        'categories:seo': ['warn', { minScore: 0.8 }],

        // CI 환경에서 통과 불가능한 항목 off
        'is-on-https': 'off',
        'csp-xss': 'off',
        'errors-in-console': 'off',
        'uses-text-compression': 'off',
        'uses-long-cache-ttl': 'off',
        'server-response-time': 'off',
        'render-blocking-resources': 'off',
        'unminified-css': 'off',
        'unused-css-rules': 'off',
        'legacy-javascript': 'off',
        'total-byte-weight': 'off',

        // PWA 관련 off
        'installable-manifest': 'off',
        'maskable-icon': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'off',

        // 접근성: warn으로 완화
        'color-contrast': 'warn',
        'meta-viewport': 'warn',
        'image-redundant-alt': 'warn',
        'landmark-one-main': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

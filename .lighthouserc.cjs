module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        // 모든 항목 warn only — 실패 없이 점수만 리포팅
        'categories:performance': ['warn', { minScore: 0 }],
        'categories:accessibility': ['warn', { minScore: 0 }],
        'categories:best-practices': ['warn', { minScore: 0 }],
        'categories:seo': ['warn', { minScore: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Yeni özellik
        'fix',      // Hata düzeltme
        'docs',     // Dokümantasyon
        'style',    // Kod formatı
        'refactor', // Kod yeniden yapılandırma
        'test',     // Test
        'chore',    // Build, config
        'perf',     // Performans
        'ci',       // CI/CD
        'revert'    // Geri alma
      ]
    ],
    'scope-enum': [
      1,
      'always',
      [
        'auth',
        'incident',
        'request',
        'change',
        'problem',
        'project',
        'asset',
        'kb',
        'notification',
        'report',
        'gateway',
        'frontend',
        'docker',
        'docs',
        'deps'
      ]
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100]
  }
};

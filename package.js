Package.describe({
  name: 'zetoff:astronomy-userstamp-behavior',
  version: '1.0.0',
  summary: 'Userstamp behavior for Meteor Astronomy',
  git: 'https://github.com/jagi/meteor-astronomy-timestamp-behavior.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');

  api.use([
    'ecmascript',
    'es5-shim',
    'accounts-base',
    'jagi:astronomy@2.0.0-rc.8',
    'stevezhu:lodash@4.6.1'
  ], ['client', 'server']);

  api.mainModule('lib/main.js', ['client', 'server']);
});

export default () => ({
  app: {
    env: process.env.APP_ENV || 'local',
    port: parseInt(process.env.APP_PORT, 10) || 8080,
    publicUrl: process.env.APP_PUBLIC_URL || '',
  },
  swagger: {
    docsUrl: process.env.DOCS_URL || 'docs',
  },
  apiVersion: 'v1',
  defaultAvatar:
    'https://firebasestorage.googleapis.com/v0/b/pbl6-a7d3b.appspot.com/o/media%2Fdefault%2Fdefault.jpg?alt=media',
});

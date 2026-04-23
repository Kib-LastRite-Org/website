import packageJson from '../../package.json';

export const getVersion = (): string => packageJson.version;

export const getVersionDisplay = (): string => `v${packageJson.version}`;

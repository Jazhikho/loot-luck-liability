import packageInfo from "../../package.json";

export const APP_VERSION = packageInfo.appVersion || `${packageInfo.version}.0`;
export const APP_SEMVER = packageInfo.version;

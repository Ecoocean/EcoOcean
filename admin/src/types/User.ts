export interface UserPermissions {
  isOnboarded: boolean;
  isAdmin: boolean;
  isReporter: boolean;
  hasChartAccess: boolean;
}

export interface UserInfo {
  displayName: string;
  email: string;
  photoURL: string;
  emailVerified: boolean;
}

export interface UserMetadata {
  creationTime: Date;
  lastRefreshTime: Date;
  lastSignInTime: Date;
}

export interface User {
  uid: string;
  userInfo: UserInfo;
  metadata: UserMetadata;
  permissions: UserPermissions;
}

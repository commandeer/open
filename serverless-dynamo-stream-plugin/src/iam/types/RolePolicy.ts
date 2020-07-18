import { IRolePolicy } from './IRolePolicy';

export class RolePolicy implements IRolePolicy {
  roleName: string;
  policyName: string;
  policyDocument: string;

  constructor(policy: IRolePolicy) {
    this.roleName = policy.roleName;
    this.policyName = policy.policyName;
    this.policyDocument = policy.policyDocument;
  }
}

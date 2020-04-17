import Iam from 'aws-sdk/clients/iam';

export interface IRolePolicy {
  roleName: string;
  policyName: string;
  policyDocument: string;
}

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

export class IamService {
  private readonly client: Iam;

  constructor(client = new Iam()) {
    this.client = client;
  }

  async listRolePolicies(roleName: string): Promise<string[]> {
    try {
      const params: Iam.ListRolePoliciesRequest = {
        RoleName: roleName,
      };

      const response = await this.client.listRolePolicies(params).promise();
      return response.PolicyNames;

    } catch (error) {
      throw error;
    }
  }

  async getRolePolicy(roleName: string, policyName: string): Promise<RolePolicy> {
    try {
      const params: Iam.GetRolePolicyRequest = {
        RoleName: roleName,
        PolicyName: policyName,
      };

      const response = await this.client.getRolePolicy(params).promise();
      return {
        roleName: response.RoleName,
        policyName: response.PolicyName,
        policyDocument: response.PolicyDocument,
      }
    } catch (error) {
      throw error;
    }
  }

  async putRolePolicy(rolePolicy: RolePolicy): Promise<boolean> {
    try {
      const params: Iam.PutRolePolicyRequest = {
        RoleName: rolePolicy.roleName,
        PolicyName: rolePolicy.policyName,
        PolicyDocument: rolePolicy.policyDocument,
      };

      await this.client.putRolePolicy(params).promise();
      return true;

    } catch (error) {
      throw error;
    }
  }
}

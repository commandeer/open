import Iam from 'aws-sdk/clients/iam';
import { RolePolicy } from './types';

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

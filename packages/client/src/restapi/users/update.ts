import { z } from 'zod';
import { apiRequest, type ApiRequestParams } from '../../API';
import {
  type PloneClientConfig,
  PloneClientConfigSchema,
} from '../../validation/config';
import { updateUserDataSchema } from '../../validation/users';

export const updateUserArgsSchema = z.object({
  userId: z.string(),
  data: updateUserDataSchema,
  config: PloneClientConfigSchema,
});

export type UpdateUserArgs = z.infer<typeof updateUserArgsSchema>;

export const updateUser = async ({
  userId,
  data,
  config,
}: UpdateUserArgs): Promise<undefined> => {
  const validatedArgs = updateUserArgsSchema.parse({
    userId,
    data,
    config,
  });

  const options: ApiRequestParams = {
    data: validatedArgs.data,
    config: validatedArgs.config,
  };

  const userName = `/@users/${validatedArgs.userId}`;

  return apiRequest('patch', userName, options);
};

export const updateUserMutation = ({
  config,
}: {
  config: PloneClientConfig;
}) => ({
  mutationKey: ['patch', 'users'],
  mutationFn: ({ userId, data }: Omit<UpdateUserArgs, 'config'>) =>
    updateUser({ userId, data, config }),
});

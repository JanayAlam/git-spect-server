import { OAUTH_PROVIDER } from "@prisma/client";
import prisma from "../../database/prisma-client";

export interface IUpsertOAuthAccountData {
  userId: string;
  provider: OAUTH_PROVIDER;
  providerId: string;
  accessToken: string;
}

export const upsertOAuthAccount = async (data: IUpsertOAuthAccountData) => {
  return prisma.oAuthAccount.upsert({
    where: {
      provider_providerId: {
        provider: data.provider,
        providerId: data.providerId,
      },
    },
    update: {
      accessToken: data.accessToken,
      userId: data.userId,
    },
    create: {
      provider: data.provider,
      providerId: data.providerId,
      accessToken: data.accessToken,
      userId: data.userId,
    },
  });
};

export const findOAuthAccountByProvider = async (
  provider: OAUTH_PROVIDER,
  providerId: string,
) => {
  return prisma.oAuthAccount.findUnique({
    where: {
      provider_providerId: {
        provider,
        providerId,
      },
    },
  });
};

export const findOAuthAccountsByUserId = async (userId: string) => {
  return prisma.oAuthAccount.findMany({
    where: { userId },
  });
};

export const deleteOAuthAccount = async (
  provider: OAUTH_PROVIDER,
  providerId: string,
) => {
  return prisma.oAuthAccount.delete({
    where: {
      provider_providerId: {
        provider,
        providerId,
      },
    },
  });
};

export const updateOAuthAccountToken = async (
  provider: OAUTH_PROVIDER,
  providerId: string,
  accessToken: string,
) => {
  return prisma.oAuthAccount.update({
    where: {
      provider_providerId: {
        provider,
        providerId,
      },
    },
    data: {
      accessToken,
    },
  });
};

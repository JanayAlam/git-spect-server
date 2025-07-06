import { OAUTH_PROVIDER } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../../database";
import NotFoundError from "../../errors/api-error-impl/NotFoundError";
import { getRepoList } from "../../services/repo";

export const getRepoListController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oAuthAccount = await prisma.oAuthAccount.findFirst({
      where: { userId: req.user.id, provider: OAUTH_PROVIDER.GITHUB },
    });

    if (!oAuthAccount || !oAuthAccount.accessToken) {
      throw new NotFoundError("GitHub is not integrated");
    }

    const repos = await getRepoList(oAuthAccount.accessToken);

    res.status(200).json(repos);
  } catch (err) {
    next(err);
  }
};

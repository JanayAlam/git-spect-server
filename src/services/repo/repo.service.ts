import { Octokit } from "@octokit/rest";

export interface IRepoListData {
  id: number;
  name: string;
  fullName: string;
  isPrivate: boolean;
  owner?: {
    username?: string;
    avatar?: string;
  };
}

export const getRepoList = async (accessToken: string) => {
  const octokit = new Octokit({
    auth: accessToken,
  });

  const repos: IRepoListData[] = [];
  let page = 1;

  while (true) {
    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 100,
      page,
      affiliation: "owner",
    });

    repos.push(
      ...data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        isPrivate: repo.private,
        owner: {
          username: repo.owner?.login,
          avatar: repo.owner?.avatar_url,
        },
      })),
    );

    if (data.length < 100) break;
    page++;
  }

  return repos;
};

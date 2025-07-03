import express, { Router } from "express";
import authRouter from "./v1/auth.router";
import healthRouter from "./v1/health.router";
import oauthRouter from "./v1/oauth.router";
import userRouter from "./v1/user.router";

interface IRoute {
  baseUrl: string;
  router: Router;
}

const configureRoutes = (app: express.Express) => {
  const routes: IRoute[] = [
    {
      baseUrl: "/health",
      router: healthRouter,
    },
    {
      baseUrl: "/auth",
      router: authRouter,
    },
    {
      baseUrl: "/oauth",
      router: oauthRouter,
    },
    {
      baseUrl: "/users",
      router: userRouter,
    },
  ];

  for (const route of routes) {
    app.use(`/api/v1${route.baseUrl}`, route.router);
  }
};

export default configureRoutes;

import express, { Router } from "express";
import authRouter from "./v1/auth.router";
import healthRouter from "./v1/health.router";

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
  ];

  for (const route of routes) {
    app.use(`/api/v1${route.baseUrl}`, route.router);
  }
};

export default configureRoutes;

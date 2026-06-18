import { Route as rootRoute } from './routes/__root'
import { Route as PublicImport } from './routes/_public'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as IndexImport } from './routes/index'

export const routeTree = rootRoute.addChildren({
  PublicImport,
  AuthenticatedImport,
  IndexImport,
}) as any;

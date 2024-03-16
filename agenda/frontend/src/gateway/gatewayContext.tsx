import { createContext, ReactNode } from 'react';
import fetchAdapter from '../http/axios/axiosAdapter';
import { HttpUserGateway } from './http/auth/httpUserGateway.local';
import { HttpEventGateway } from './http/event/httpEventGateway.local';
interface GatewayContextType {
  userGateway: HttpUserGateway,
  eventGateway: HttpEventGateway,
}

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

interface GatewayProviderProps {
  children: ReactNode;
}

function GatewayProvider({ children }: GatewayProviderProps) {
  const httpClient = new fetchAdapter();
  const userGateway = new HttpUserGateway(httpClient);
  const eventGateway = new HttpEventGateway(httpClient);

  return (
    <GatewayContext.Provider value={{ userGateway, eventGateway }}>
      {children}
    </GatewayContext.Provider>
  );
}

export { GatewayContext, GatewayProvider };

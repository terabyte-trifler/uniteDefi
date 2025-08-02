// pages/_app.js
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultConfig,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';

import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

// 🔧 Create QueryClient instance
const queryClient = new QueryClient();

// ✅ Create Wagmi config
const config = getDefaultConfig({
  appName: 'Loyalty DApp',
  projectId: 'loyalty-dapp-id',
  chains: [sepolia],
  ssr: false,
});

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={[sepolia]}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

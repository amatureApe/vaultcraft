import { localhost, mainnet } from "wagmi/chains";
import AdapterDefaultResolvers from ".";

export async function resolveAdapterDefaults({ chainId, address, resolver }: { chainId: number, address: string, resolver?: string }): Promise<any[]> {
  if (chainId === localhost.id) chainId = mainnet.id;
  
  try {
    return resolver ? AdapterDefaultResolvers[resolver]({ chainId, address }) : AdapterDefaultResolvers.default({ chainId, address })
  } catch (e) {
    console.log(`resolveAdapterDefaults-${chainId}-${address}-${resolver}`, e)
    return []
  }
}
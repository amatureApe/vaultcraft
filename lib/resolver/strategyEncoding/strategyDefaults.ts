import { localhost, mainnet } from "wagmi/chains";
import StrategyEncodingResolvers from ".";

export async function resolveStrategyEncoding({ chainId, address, params, resolver }: { chainId: number, address: string, params: any[], resolver?: string }): Promise<string> {
  if (chainId === localhost.id) chainId = mainnet.id;
  try {
    return resolver ? StrategyEncodingResolvers[resolver]({ chainId, address, params }) : StrategyEncodingResolvers.default({ chainId, address, params })
  } catch (e) {
    console.log(`resolveStrategyEncoding-${chainId}-${address}-${resolver}`, e)
    return ""
  }
}
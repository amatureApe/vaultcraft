import { BASIC_CREATION_STAGES } from "@/lib/stages";
import { useRouter } from "next/router";
import { atom, useAtom } from "jotai";
import { metadataAtom, assetAtom, protocolAtom, adapterAtom, strategyAtom, Asset, assetAddressesAtom, availableAssetsAtom, networkAtom, adapterConfigAtom, strategyConfigAtom, adapterDeploymentAtom, strategyDeploymentAtom, useProtocols } from "@/lib/atoms";
import MainActionButton from "@/components/buttons/MainActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import AdapterSelection from "@/components/sections/AdapterSelection";
import MetadataConfiguration from "@/components/sections/MetadataConfiguration";
import VaultCreationContainer from "@/components/VaultCreationContainer";
import DepositLimitConfiguration from "@/components/sections/DepositLimitConfiguration";
import StrategySelection from "@/components/sections/StrategySelection";
import { useEffect, useState } from "react";
import AssetSelection from "@/components/sections/AssetSelection";
import ProtocolSelection from "@/components/sections/ProtocolSelection";
import { ethers } from "ethers";
import { resolveStrategyDefaults } from "@/lib/resolver/strategyDefaults/strategyDefaults";
import { resolveStrategyEncoding } from "@/lib/resolver/strategyEncoding/strategyDefaults";
import getSupportedAssetAddresses from "@/lib/getSupportedAssetAddresses";


export const basicsAtom = atom(get => ({
  metadata: get(metadataAtom),
  asset: get(assetAtom),
  protocol: get(protocolAtom),
  strategy: get(strategyAtom),
}))

export function isBasicsValid(basics: any): boolean {
  if (basics.metadata.name.length < 3) return false;
  if (basics.asset.symbol === "none") return false;
  if (basics.protocol.key === "none") return false;
  return true;
}

export default function Basics() {
  const router = useRouter();
  const [basics] = useAtom(basicsAtom)
  const [strategy] = useAtom(strategyAtom);
  const [network] = useAtom(networkAtom);
  const [asset] = useAtom(assetAtom);

  const protocols = useProtocols()

  const [loading, setLoading] = useState(false)

  const [, setStrategyConfig] = useAtom(strategyConfigAtom);

  const [, setAvailableAssetAddresses] = useAtom(assetAddressesAtom);

  useEffect(() => { getSupportedAssetAddresses(1, protocols).then((res: any) => setAvailableAssetAddresses({ 1: res })) }, [])

  useEffect(() => {
    // @ts-ignore
    async function getStrategyDefaults() {
      setLoading(true)

      let strategyDefaults = []

      if (strategy.name.includes("Depositor")) {
        if (strategy.initParams && strategy.initParams.length > 0) {
          strategyDefaults = await resolveStrategyDefaults({
            chainId: network.id,
            address: asset.address[network.id].toLowerCase(),
            resolver: strategy.resolver
          })
        }
      } else {
        strategyDefaults = await resolveStrategyDefaults({
          chainId: network.id,
          address: asset.address[network.id].toLowerCase(),
          resolver: strategy.resolver
        })
      }
      setStrategyConfig(strategyDefaults)
      setLoading(false)
    }

    if (strategy.key !== "none") getStrategyDefaults();
  }, [strategy])

  return (
    <VaultCreationContainer activeStage={0} stages={BASIC_CREATION_STAGES} >
      <div className="mb-6">
        <h1 className="text-[white] text-2xl mb-2">Set up a new vault</h1>
        <p className="text-white">
          Choose a name for your vault, than select an asset and see what protocols have to offer.
        </p>
      </div>

      <div className={`flex flex-col gap-6`}>
        <MetadataConfiguration />
        <div className="flex flex-col md:flex-row gap-6 md:gap-4">
          <AssetSelection />
          <ProtocolSelection />
        </div>
        <StrategySelection isDisabled={basics.protocol.key === "none"} />
        <DepositLimitConfiguration />
      </div>

      {strategy.key !== "none" && loading && <p className="text-white mt-6">Loading Configuration, please wait...</p>}

      <div className="flex justify-end mt-8 gap-3">
        <SecondaryActionButton
          label="Back"
          handleClick={() => router.push('/')}
          className={`max-w-[100px]`}
        />
        <MainActionButton
          label="Next"
          handleClick={() => router.push('/easy/fees')}
          className={`max-w-[100px]`}
          disabled={!isBasicsValid(basics) || loading}
        />
      </div>
    </VaultCreationContainer>
  )
}

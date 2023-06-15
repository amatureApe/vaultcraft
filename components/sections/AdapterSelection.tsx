import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { Adapter, adapterAtom, adapterConfigAtom, useAdapters, protocolAtom, networkAtom, assetAtom, strategyAtom, DEFAULT_STRATEGY } from "@/lib/atoms";
import { resolveProtocolAssets } from "@/lib/resolver/protocolAssets/protocolAssets";
import Selector, { Option } from "@/components/inputs/Selector";

interface AdapterOption extends Adapter {
  disabled: boolean;
}

async function assetSupported(adapter: Adapter, chainId: number, asset: string): Promise<boolean> {
  const availableAssets = await resolveProtocolAssets({ chainId: chainId, resolver: adapter.resolver })

  return availableAssets.flat().map(a => a.toLowerCase()).filter((availableAsset) => availableAsset === asset).length > 0
}

async function getAdapterOptions(adapters: Adapter[], chainId: number, asset: string): Promise<AdapterOption[]> {
  return Promise.all(
    adapters.map(async (adapter) => {
      return { ...adapter, disabled: !(await assetSupported(adapter, chainId, asset)) }
    })
  )
}

function AdapterSelection() {
  const [network] = useAtom(networkAtom);
  const [protocol] = useAtom(protocolAtom);
  const [asset] = useAtom(assetAtom);

  const [adapter, setAdapter] = useAtom(adapterAtom);
  const adapters = useAdapters();
  const [options, setOptions] = useState<AdapterOption[]>([]);

  // Only for reset
  const [, setAdapterConfig] = useAtom(adapterConfigAtom);
  const [, setStrategy] = useAtom(strategyAtom);

  useEffect(() => {
    if (protocol.key !== "none" && asset.symbol !== "none" && network) {
      getAdapterOptions(
        adapters.filter((adapter) => adapter.protocol === protocol.key).filter(adapter => adapter.chains.includes(network.id)),
        network.id,
        asset.address[network.id].toLowerCase()
      )
        .then(res => {
          setOptions(res);
          if (res.length > 0 && adapter.key === "none") setAdapter(res[0]);
        });
    }
  }, [protocol, asset, network]);

  function selectAdapter(newAdapter: any) {
    if (adapter !== newAdapter) {
      setAdapterConfig([])
      setStrategy(DEFAULT_STRATEGY)
    }
    setAdapter(newAdapter)
  }

  return (
    <section className="mb-4">
      <Selector
        selected={adapter}
        onSelect={(newAdapter) => selectAdapter(newAdapter)}
        actionContent={(selected) => (
          <div className="h-12 flex flex-row items-center w-full gap-x-2">
            {selected?.logoURI && (
              <div className="w-9 h-8">
                <img
                  className="object-contain w-8 h-8 rounded-full"
                  alt="selected-adapter"
                  src={selected?.logoURI}
                />
              </div>
            )}
            <span className="text-[white] w-full flex self-center flex-row justify-start">{selected?.name || "Adapter selection"}</span>
            <span className="self-center text-[white] mr-2">{`>`}</span>
          </div>
        )}
      >
        <div className="w-full h-full bg-black flex flex-col items-start gap-y-1 px-8 py-9">
          <p className="text-[white] text-2xl mb-9">Select Adapter</p>
          <p className="text-[white] mb-8">Choose an adapter for your chosen protocol.</p>
          <div className="flex flex-col overflow-y-scroll scrollbar-hide w-full">
            {options.map((adapterIter) => (
              <Option
                value={adapterIter}
                selected={adapterIter.name === adapter.name}
                key={`adapter-selc-${adapterIter.key}-${adapterIter.name}`}
              >
              </Option>
            ))}
          </div>
        </div>
      </Selector>
    </section>
  );
}

export default AdapterSelection;

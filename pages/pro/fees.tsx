import { PRO_CREATION_STAGES } from "@/lib/stages";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { constants, utils } from "ethers";
import { feeAtom } from "@/lib/atoms/fees";
import MainActionButton from "@/components/buttons/MainActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import FeeConfiguration from "@/components/sections/FeeConfiguration";
import VaultCreationContainer from "@/components/VaultCreationContainer";

export function isFeesValid(fees: any): boolean {
  if (Object.keys(fees).filter(key => key !== 'recipient').reduce((acc, key) => acc + Number(fees[key]), 0) >= 100) return false;
  if (!utils.isAddress(fees.recipient) || fees.recipient === constants.AddressZero || fees.recipient.length === 0) return false;
  return true;
}

export default function Fees() {
  const router = useRouter();
  const [fees] = useAtom(feeAtom);

  return (
    <VaultCreationContainer activeStage={2} stages={PRO_CREATION_STAGES} >
      <div className={`mb-6`}>
        <h1 className="text-white text-2xl mb-2">Fee Configuration</h1>
        <p className="text-white">
          Vault managers can charge several types of fees, all of which are paid out in shares of the vault. Fees can be changed at any time after vault creation.
        </p>
      </div>

      <FeeConfiguration />

      <div className="flex justify-end mt-8 gap-3">
        <SecondaryActionButton label="Back" handleClick={() => router.push('/pro/strategy')} className={`max-w-[100px]`} />
        <MainActionButton label="Next" handleClick={() => router.push('/pro/review')} disabled={!isFeesValid(fees)} className={`max-w-[100px]`} />
      </div>
    </VaultCreationContainer>
  )
}

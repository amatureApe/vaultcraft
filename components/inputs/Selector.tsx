import { Fragment } from "react";
import { Listbox } from "@headlessui/react";

function Selector({
  selected,
  onSelect,
  children,
  actionContent,
}: {
  selected?: any;
  onSelect: (value: any) => void;
  children: any;
  actionContent: (selected: any) => JSX.Element;
}) {
  return (
    <Listbox
      className="self-start w-full border-none"
      as="div"
      value={selected}
      onChange={onSelect}
    >
      <Listbox.Button className="border-1 border border-[#353945] rounded-lg flex gap-2 w-full px-2">
        {actionContent(selected)}
      </Listbox.Button>
      <Listbox.Options className="z-[1] absolute flex flex-col min-w-[12rem] rounded-[20px] top-0 left-0 p-2 bg-black md:max-h-[80vh] w-full h-full overflow-auto">
        {children}
      </Listbox.Options>
    </Listbox >
  );
}

export function Option({ value, children, selected, disabled }: { value: any; children: any, selected: boolean, disabled?: boolean }) {
  return (
    <Listbox.Option value={value} as={Fragment} disabled={disabled}>
      {({ active }) => {
        return (
          <button
            className={`flex flex-row text-left h-14 p-2 rounded-lg ${disabled ? "hover:bg-red-600 cursor-not-allowed" : "hover:bg-[gray]"} 
            ${selected ? 'bg-[white]' : ''}`}
            disabled={disabled}
          >
            <img
              alt=""
              className="object-contain relative h-10 w-10 mr-4 rounded-full"
              src={value.logoURI}
            />
            <div className="flex flex-col self-center">
              <p className={`${selected ? "text-[black]" : "text-[white]"}`}>{value.symbol}</p>
              <span className="flex flex-row">
                <p className={`${selected ? "text-[black]" : "text-[#ffffff99]"}`}>{value.name}</p>
                {disabled && <p className={`ml-1 ${selected ? "text-[black]" : "text-[#ffffff99]"}`}>- Asset not supported</p>}
              </span>
            </div>
          </button>
        );
      }}
    </Listbox.Option>
  );
}

export default Selector;

import { create } from "zustand";
import { Address } from "../models/Address";

interface AddressStore {
  addressList: Address[];
  addAddress: (address: Address) => void;
  removeAddress: (index: number) => void;
  clearAddresses: () => void;
  setAddressList: (addresses: Address[]) => void;
}

const useAddressStore = create<AddressStore>((set) => ({
  addressList: [] as Address[],
  addAddress: (address: Address) =>
    set((state: { addressList: Address[] }) => ({
      addressList: [...state.addressList, address],
    })),
  removeAddress: (index: number) =>
    set((state: { addressList: Address[] }) => ({
      addressList: state.addressList.filter((_, i) => i !== index),
    })),
  clearAddresses: () => set({ addressList: [] }),
  setAddressList: (addresses: Address[]) => set({ addressList: addresses }),
}));

export { useAddressStore };

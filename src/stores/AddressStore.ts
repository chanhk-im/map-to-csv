import { create } from "zustand";
import { Address } from "../models/Address";

interface AddressStore {
  addressList: Address[];
  addAddress: (address: Address) => void;
  editAddress: (index: number, address: string) => void;
  removeAddress: (index: number) => void;
  clearAddresses: () => void;
  setAddressList: (addresses: Address[]) => void;
  moveAddress: (index: number, direction: "up" | "down") => void;
}

const useAddressStore = create<AddressStore>((set) => ({
  addressList: [] as Address[],
  addAddress: (address: Address) =>
    set((state: { addressList: Address[] }) => ({
      addressList: [...state.addressList, address],
    })),
  editAddress: (index: number, address: string) =>
    set((state: { addressList: Address[] }) => {
      const newList = [...state.addressList];
      newList[index].address = address;
      return { addressList: newList };
    }),
  removeAddress: (index: number) =>
    set((state: { addressList: Address[] }) => ({
      addressList: state.addressList.filter((_, i) => i !== index),
    })),
  clearAddresses: () => set({ addressList: [] }),
  setAddressList: (addresses: Address[]) => set({ addressList: addresses }),
  moveAddress: (index: number, direction: "up" | "down") =>
    set((state: { addressList: Address[] }) => {
      const newList = [...state.addressList];
      const newIndex = direction === "down" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= newList.length) {
        return state;
      }

      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
      return { addressList: newList };
    }),
}));

export { useAddressStore };

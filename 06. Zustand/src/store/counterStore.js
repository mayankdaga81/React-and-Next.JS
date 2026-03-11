import { create } from "zustand";

export const useCounterStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// In Zustand, we write () => (), multiple times.
// 1st, create((set)=>({...}))
// 2nd, increase: () => set(...)
// 3rd set((state)=>({...}))

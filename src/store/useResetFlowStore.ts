import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ResetFlowState = {
  resetEmail: string;
  resetToken: string;
  setResetEmail: (email: string) => void;
  setResetToken: (token: string) => void;
  clearResetFlow: () => void;
};

export const useResetFlowStore = create<ResetFlowState>()(
  persist(
    (set) => ({
      resetEmail: "",
      resetToken: "",
      setResetEmail: (email) => set({ resetEmail: email }),
      setResetToken: (token) => set({ resetToken: token }),
      clearResetFlow: () => set({ resetEmail: "", resetToken: "" }),
    }),
    {
      name: "BigCart_reset_flow",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

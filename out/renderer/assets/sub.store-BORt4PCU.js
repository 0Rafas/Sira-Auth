import { D as create, F as persist } from "./index-Bnbhtkos.js";
const useSubStore = create()(
  persist(
    (set, get) => ({
      subscriptions: {},
      addSub: (appId, sub) => set({
        subscriptions: {
          ...get().subscriptions,
          [appId]: [...get().subscriptions[appId] ?? [], sub]
        }
      }),
      updateSub: (appId, subId, patch) => set({
        subscriptions: {
          ...get().subscriptions,
          [appId]: (get().subscriptions[appId] ?? []).map(
            (s) => s.id === subId ? { ...s, ...patch } : s
          )
        }
      }),
      deleteSub: (appId, subId) => set({
        subscriptions: {
          ...get().subscriptions,
          [appId]: (get().subscriptions[appId] ?? []).filter((s) => s.id !== subId)
        }
      }),
      deleteSelected: (appId, ids) => set({
        subscriptions: {
          ...get().subscriptions,
          [appId]: (get().subscriptions[appId] ?? []).filter((s) => !ids.includes(s.id))
        }
      })
    }),
    { name: "sira_sub_store", partialize: (s) => ({ subscriptions: s.subscriptions }) }
  )
);
export {
  useSubStore as u
};

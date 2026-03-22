import { create } from "zustand";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface Order {
  id: string;
  planId: string;
  planName: string;
  status: string;
  canvaEmail: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
}

interface UserStore {
  notifications: Notification[];
  orders: Order[];
  isLoading: boolean;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setLoading: (loading: boolean) => void;
  unreadCount: () => number;
}

export const useUserStore = create<UserStore>((set, get) => ({
  notifications: [],
  orders: [],
  isLoading: false,

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  setOrders: (orders) => set({ orders }),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,
}));

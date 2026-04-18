"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

import {
  isConnected as freighterIsConnected,
  isAllowed,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api";

interface FreighterState {
  isInstalled: boolean;
  isConnected: boolean;
  publicKey: string | null;
  isLoading: boolean;
  error: string | null;
}

interface FreighterContextValue extends FreighterState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const initialState: FreighterState = {
  isInstalled: false,
  isConnected: false,
  publicKey: null,
  isLoading: true,
  error: null,
};

const FreighterContext = createContext<FreighterContextValue | undefined>(
  undefined
);

function errorMessage(err: unknown, fallback: string): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return fallback;
}

export function FreighterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FreighterState>(initialState);

  const checkConnection = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const connectedResult = await freighterIsConnected();
      if (connectedResult.error || !connectedResult.isConnected) {
        setState({
          isInstalled: false,
          isConnected: false,
          publicKey: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      const allowedResult = await isAllowed();
      if (allowedResult.error || !allowedResult.isAllowed) {
        setState({
          isInstalled: true,
          isConnected: false,
          publicKey: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      const addressResult = await getAddress();
      if (addressResult.error || !addressResult.address) {
        setState({
          isInstalled: true,
          isConnected: false,
          publicKey: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      setState({
        isInstalled: true,
        isConnected: true,
        publicKey: addressResult.address,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage(err, "Unknown error while checking wallet"),
      }));
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connect = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const connectedResult = await freighterIsConnected();
      if (connectedResult.error || !connectedResult.isConnected) {
        setState((prev) => ({
          ...prev,
          isInstalled: false,
          isLoading: false,
          error: "Freighter extension not found. Install it from freighter.app and refresh.",
        }));
        return;
      }

      const accessResult = await requestAccess();
      if (accessResult.error) {
        const msg = errorMessage(accessResult.error, "Failed to connect");
        setState((prev) => ({
          ...prev,
          isInstalled: true,
          isLoading: false,
          error: msg.toLowerCase().includes("declined") || msg.toLowerCase().includes("denied")
            ? "Connection rejected in Freighter."
            : msg,
        }));
        return;
      }

      if (!accessResult.address) {
        setState((prev) => ({
          ...prev,
          isInstalled: true,
          isLoading: false,
          error: "Could not retrieve wallet address from Freighter.",
        }));
        return;
      }

      setState({
        isInstalled: true,
        isConnected: true,
        publicKey: accessResult.address,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage(err, "Failed to connect"),
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isInstalled: true,
      isConnected: false,
      publicKey: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return (
    <FreighterContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </FreighterContext.Provider>
  );
}

export function useFreighter(): FreighterContextValue {
  const context = useContext(FreighterContext);
  if (context === undefined) {
    throw new Error("useFreighter must be used within a <FreighterProvider>");
  }
  return context;
}

export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address || address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

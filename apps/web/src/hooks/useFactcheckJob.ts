type Result = {
  start: () => Promise<void>;
  cancel: () => Promise<void>;
  data: unknown;
  isLoading: boolean;
  error: unknown;
};

export default function useFactcheckJob(): Result {
  return {
    start: async () => {},
    cancel: async () => {},
    data: null,
    isLoading: false,
    error: null
  };
}

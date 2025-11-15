export function Logo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <path
          d="M19.3333 4H12.6667V11.3333H19.3333V4Z"
          fill="#1E1E1E"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 12.6667H20.6667V19.3333H28V12.6667Z"
          fill="#1E1E1E"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.3333 20.6667H4V28H11.3333V20.6667Z"
          fill="#1E1E1E"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h1 className="text-3xl font-bold">Splitz</h1>
    </div>
  );
}

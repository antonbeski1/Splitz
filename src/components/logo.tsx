export function Logo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="text-accent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            d="M22.6667 9.33333L24.3333 4L26 9.33333L32 11L26 12.6667L24.3333 18L22.6667 12.6667L16.6667 11L22.6667 9.33333Z"
            fill="currentColor"
          />
          <path
            d="M9.33333 18.6667L11.3333 14L13.3333 18.6667L18 20.6667L13.3333 22.6667L11.3333 27.3333L9.33333 22.6667L4.66666 20.6667L9.33333 18.6667Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold">Splitz</h1>
    </div>
  );
}

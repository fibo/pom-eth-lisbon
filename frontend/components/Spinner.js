export const Spinner = () => {
  return (
    <svg
      width="71"
      height="71"
      viewBox="0 0 66 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M33 12.9375V0.9375L17.0625 17.0625L33 33V21C46.3125 21 57 31.6875 57 45C57 49.125 56.0625 52.875 54.1875 56.25L60 62.0625C63.1875 57.1875 65.0625 51.1875 65.0625 45C65.0625 27.375 50.625 12.9375 33 12.9375ZM33 69C19.6875 69 9 58.3125 9 45C9 40.875 9.9375 37.125 11.8125 33.75L6 27.9375C2.8125 32.8125 0.9375 38.8125 0.9375 45C0.9375 62.625 15.375 77.0625 33 77.0625V89.0625L48.9375 72.9375L33 57V69Z"
        fill="#5D5D5B"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="360 33 45"
          to="0 33 45"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}

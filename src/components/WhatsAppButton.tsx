import { motion } from "motion/react"

function WhatsAppButton() {
  const whatsappNumber = "919080922296"

  const message = encodeURIComponent(
    "Hello Sugan Raj, I visited your portfolio website and would like to discuss a project with you."
  )

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with me on WhatsApp"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.8,
        type: "spring",
        stiffness: 180,
      }}
      whileHover={{
        scale: 1.08,
        y: -3,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-white sm:h-8 sm:w-8"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M19.11 17.08c-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.63 1.11 2.81.14.18 1.93 2.95 4.67 4.13.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.58-.65 1.8-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32Z"
        />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M16 2.67C8.64 2.67 2.67 8.64 2.67 16c0 2.35.61 4.55 1.68 6.47L2.58 29.33l7.04-1.75A13.28 13.28 0 0 0 16 29.33c7.36 0 13.33-5.97 13.33-13.33S23.36 2.67 16 2.67Zm0 24c-2.17 0-4.2-.63-5.91-1.72l-.42-.27-4.18 1.04 1.06-4.07-.28-.44A10.62 10.62 0 1 1 16 26.67Z"
          clipRule="evenodd"
        />
      </svg>

      <span className="absolute -right-1 -top-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-60" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#25D366]" />
      </span>
    </motion.a>
  )
}

export default WhatsAppButton
type TestimonialCardProps = {
  name: string
  role: string
  message: string
}

function TestimonialCard({
  name,
  role,
  message,
}: TestimonialCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      
      {/* Quote */}
      <div className="text-4xl leading-none text-blue-500">
        "
      </div>

      {/* Message */}
      <p className="mt-4 leading-7 text-slate-300">
        {message}
      </p>

      {/* Client Information */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <h3 className="font-semibold text-white">
          {name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {role}
        </p>
      </div>

    </article>
  )
}

export default TestimonialCard
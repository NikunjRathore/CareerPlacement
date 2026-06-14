function TextInput({ label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input
        className="h-12 rounded-lg border border-slate-300 bg-white/90 px-4 text-base text-slate-950 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-400 focus:border-0 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:shadow-lg focus:shadow-teal-200"
        {...props}
      />
    </label>
  )
}

export default TextInput

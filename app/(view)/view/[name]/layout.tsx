export default function ViewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <style>{`
        body,
        html {
          background-color: transparent !important;
        }
      `}</style>
      {children}
    </div>
  )
}

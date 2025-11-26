export default function Footer() {
  return (
    <footer className='w-full border-t py-6 px-6 mt-8'>
      <div className='max-w-5xl mx-auto text-center text-sm text-slate-500'>
        <div>
          © {new Date().getFullYear()} Time Call — built for small hourly alerts
        </div>
        <div className='mt-1'>
          Made with purpose — minimal, accessible, testable
        </div>
      </div>
    </footer>
  )
}

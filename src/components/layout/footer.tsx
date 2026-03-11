export function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p className="m-0">Powered by GDG Community</p>
        <div className="flex gap-4">
          <a className="focus-ring rounded-sm" href="mailto:hello@gdg.dev">hello@gdg.dev</a>
          <a className="focus-ring rounded-sm" href="#">Privacy</a>
          <a className="focus-ring rounded-sm" href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

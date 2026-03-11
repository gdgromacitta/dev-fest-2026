type MapEmbedProps = {
  src: string;
  title: string;
};

export function MapEmbed({ src, title }: MapEmbedProps) {
  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="h-80 w-full rounded-xl border border-slate-200"
    />
  );
}

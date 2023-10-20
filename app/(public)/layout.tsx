interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return <div className="h-full dark:bg-[#1F1F1F]">{children}</div>;
}

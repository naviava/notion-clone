interface layoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: layoutProps) {
  return <div>{children}</div>;
}

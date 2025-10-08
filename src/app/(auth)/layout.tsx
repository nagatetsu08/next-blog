export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // min-h-screenは要素の最小高さを画面の高さ（ビューポートの高さ）= 要素を縦方向に最低でも画面いっぱいの高さとする
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      {children}
    </div>
  );
}

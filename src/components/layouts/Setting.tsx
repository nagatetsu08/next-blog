import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"

// オブジェクトを引数にとる時のtypescirpt特有の書き方
// typescriptはオブジェクト内のプロパティの型までみるので、{params: オブジェクトの型}という特殊な書き方になる。
// ちなみにオブジェクトが引数の場合は、「{params}: {params: paramsの型}」と「params: {params: paramsの型}」の2種類ある。
// 前者は引数を分割代入で受け取る場合で、reactコンポーネントはこの形。後者は分割代入で受け取らず、受け取った後に内部でドット記法で取り出すやり方の際に使われる。


export default function Setting({session}: {session: Session}) {

  const handleLogout = async() => {
    'use server'
    await signOut
  }

  // 以下の書き方でも問題なし
  // async function handleLogout() {
  //   'use server'
  //   await signOut    
  // }

  return (
    // 通常はshadcnのデフォルトのボタンになってしまうが、asChildを使うことで、配下にカスタムコンポーネントを追加できる
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* variantはshadcnが利用しているボタンデザインのバリエーションのこと。
        ghostは「背景色が透明 or ごく薄色」「余白や形の一部は通常通り」「ホバー時だけうっすら背景変化」などの特徴がある */}
        <Button variant="ghost" className="font-medium">
          {session.user?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">ログアウト</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

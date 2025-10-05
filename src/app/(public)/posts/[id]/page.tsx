import { notFound } from "next/navigation"
import { getPost } from "@/lib/post"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { ja } from "date-fns/locale"
import { format } from 'date-fns'

// 動的パラメータ型の定義

// Next.js 15からの新しいApp Routerの仕様変更により、動的ルートの params がPromise型で渡されるようになったからこのような形になっている。
// 従来（Next.js 14以前）は、動的ルートのparamsは単純なオブジェクト（例：{ id: string }）だった。
// なので動的パラメータの場合は、必ず以下のように書く必要がある（でないと型エラーとなる）

// Nexyt15から
type Params = {
  params: Promise<{id: string}>
}

// Next14まで
// type Params = {
//   params: { id: string }
// }

export default async function PostPage({params}: Params) {
  const {id} = await params
  const post = await getPost(id)

  if(!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto pt-0">
        {post.topImage && (
          <div className="relative w-full h-64 lg:h-96">
            <Image
              src={post.topImage}
              alt={post.title}
              fill
              sizes="100vw"
              className="rounded-t-md object-cover"
              priority
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">投稿者： {post.author.name}</p>
            <time className="text-sm text-gray-500">{format(new Date(post.createdAt), 'yyyy-MM-dd', {locale: ja})}</time>
          </div>
          <CardTitle className="text-3l font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {post.content}
        </CardContent>
      </Card>
      
    </div>
  )
}

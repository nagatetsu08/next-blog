import { notFound } from "next/navigation"
import { getOwnPost } from "@/lib/ownPost"
import { auth } from "@/auth"
import EditPostForm from "./EditPostForm"

type Params = {
  params: Promise<{postId: string}>
}

export default async function EditPage({params}: Params) {

  const session = await auth()
  const userId = session?.user?.id

  // ここでnullチェックをしないとgetOwnPostsでラーとなる（userIdがnullである可能性もあるから）
  if(!session?.user?.email || !userId) {
    throw new Error('不正なリクエストです')
  }

  const {postId} = await params
  const post = await getOwnPost(userId, postId)

  if(!post) {
    notFound()
  }

  return (
    <EditPostForm post={post}/>
  )
}

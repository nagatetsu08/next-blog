'use server';
import { prisma } from '@/lib/prisma';
import { redirect } from "next/navigation";


type ActionState = {
  success: boolean,
  // Typesciptのユーティリティ型の一つ。エラーメッセージなど複数の値を管理する際にキー、バリュー形式でまとめる
  // 初期値としてキーが何もないことを示すために、errors: {} と書いてもOK
  errors: Record<string, string[]>
}

export async function deletePost(postId: string
): Promise<ActionState> {

  // DB削除
  try {
    await prisma.post.delete({
      where : {
        id: postId
      }
    })
  } catch(error) {
    console.log(error)
    return { success: false, errors: {db: ['レコードの削除に失敗しました']} }
  }

  redirect('/dashboard')
}
'use server';
import { postScheama } from "@/validations/post"; //サーバ側でバリデーションをかける 
import { saveImage } from "@/utils/image";
import { prisma } from '@/lib/prisma';
import { auth } from "@/auth";
import { redirect } from "next/navigation";


type ActionState = {
  success: boolean,
  // Typesciptのユーティリティ型の一つ。エラーメッセージなど複数の値を管理する際にキー、バリュー形式でまとめる
  // 初期値としてキーが何もないことを示すために、errors: {} と書いてもOK
  errors: Record<string, string[]>
}

export async function createPost(prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  // formを取得
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const topImageInput = formData.get('topImage')
  const topImage = topImageInput instanceof File ? topImageInput : null

  // validationをかける
  // safeParseを使うことで引っかかってもErrorをthrowしないようにして、こちらでハンドリングできるようにする
  const validationResult = postScheama.safeParse({title, content, topImage})
  if(!validationResult.success) {
    return {success: false, errors: validationResult.error.flatten().fieldErrors}
  }

  // 画像保存
  const imageUrl = topImage ? await saveImage(topImage) : null
  if(topImage && !imageUrl) {
    return {success: false, errors: {image: ['画像の保存に失敗しました']}}
  }

  // DB保存
  const session = await auth()
  const userId = session?.user?.id
  if(!session?.user?.email || !userId) {
    throw new Error('不正なリクエストです')
  }
  
  try {
    await prisma.post.create({
      data: {
        title: title,
        content: content,
        topImage: imageUrl,
        published: true,
        authorId: userId
      }
    })
  } catch(error) {
    return { success: false, errors: {db: ['データベースへの保存に失敗しました']} }
  }

  redirect('/dashboard')
}
'use server';
import { postScheama } from "@/validations/post"; //サーバ側でバリデーションをかける 
import { saveImage } from "@/utils/image";
import { prisma } from '@/lib/prisma';
import { redirect } from "next/navigation";


type ActionState = {
  success: boolean,
  // Typesciptのユーティリティ型の一つ。エラーメッセージなど複数の値を管理する際にキー、バリュー形式でまとめる
  // 初期値としてキーが何もないことを示すために、errors: {} と書いてもOK
  errors: Record<string, string[]>
}

export async function updatePost(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {
  // formを取得
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const topImageInput = formData.get('topImage')
  const topImage = topImageInput instanceof File ? topImageInput : null
  const postId = formData.get('postId') as string
  const published = formData.get('published') === 'true'
  const oldImageUrl = formData.get('oldImageUrl') as string

  // validationをかける
  // safeParseを使うことで引っかかってもErrorをthrowしないようにして、こちらでハンドリングできるようにする
  const validationResult = postScheama.safeParse({title, content, topImage})
  if(!validationResult.success) {
    return {success: false, errors: validationResult.error.flatten().fieldErrors}
  }

  // 画像保存
  let imageUrl = oldImageUrl
  if(topImage instanceof File && topImage.size > 0 && topImage.name !== 'undefiend') {
    
    const newImageUrl = await saveImage(topImage)
    if(!newImageUrl) {
      return {success: false, errors: {image: ['画像の保存に失敗しました']}}
    }
    imageUrl = newImageUrl
  }

  // DB更新
  
  try {
    await prisma.post.update({
      where : {
        id: postId
      },
      data: {
        title: title,
        content: content,
        topImage: imageUrl,
        published: published,
      }
    })
  } catch(error) {
    return { success: false, errors: {db: ['データベースへの保存に失敗しました']} }
  }

  redirect('/dashboard')
}
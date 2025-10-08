'use server';

import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/validations/user';
import bcryptjs from 'bcryptjs';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';

type ActionState = {
  success: boolean,
  // Typesciptのユーティリティ型の一つ。エラーメッセージなど複数の値を管理する際にキー、バリュー形式でまとめる
  // 初期値としてキーが何もないことを示すために、errors: {} と書いてもOK
  errors: Record<string, string[]>
}

// バリデーションエラー処理
function handleValidationError(error: ZodError): ActionState {
  const { fieldErrors, formErrors } = error.flatten();
  // zodの仕様でパスワード一致確認のエラーは formErrorsで渡ってくる
  // formErrorsがある場合は、confirmPasswordフィールドにエラーを追加
  // fieldErrorsにundefinedが入らないようにキャスト
  const castedFieldErrors = fieldErrors as Record<string, string[]>; //よく使うRecord型変換をするとundefiendを取り除ける。（ZodErrorにはundefiend型が含まれていないため）
  if (formErrors.length > 0) {
    return { success: false, errors: { ...fieldErrors, confirmPassword: formErrors
  }}}
  return { success: false, errors: castedFieldErrors };
}
// カスタムエラー処理
function handleError(customErrors: Record<string, string[]>): ActionState {
  return { success: false, errors: customErrors };
}

export async function createUser(
  prevState: ActionState, 
  formData: FormData
): Promise<ActionState> {

  // フォームから渡ってきた値を取得
  
  // 個々にとるやり方
  //const name = formData.get('name') as string;

  // まとめてとるやり方
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map((field) => [
      field,
      formData.get(field) as string
    ])
  ) as Record<string, string>

  // バリデーション
  const validationResult = registerSchema.safeParse(rawFormData);

  if(!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  // DBにメールアドレスが登録されているか
  const existingUser = await prisma.user.findUnique({
    where: {email: rawFormData.email}
  })
  if(existingUser) {
    return handleError({email: ['このメールアドレスはすでに登録されています']})
  }

  // DBに登録

  const hasedPassword = await bcryptjs.hash(rawFormData.password, 12)
  await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hasedPassword
    }
  })

  // ダッシュボードにリダイレクト
  await signIn('credentials', {
    ...Object.fromEntries(formData),
    redirect: false
  });

  // リダイレクトをすれば戻り値：Promise<ActionState>のエラーが消える（returnかリダイレクトがないとエラーがでる）
  redirect('/dashboard')
}


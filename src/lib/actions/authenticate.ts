'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData, //FormData型はTypescript標準で用意されている型
) {
  try {
    // Next-learnの公式サイトの記載だと、ログイン後のURLが/loginのまま。
    // 以下のようにしてあげることで、デフォルトのredirectを無効にしつつ、サインインしてからredirectをかけてくれるので
    // URLも正しい表記になる
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false
    });

    redirect('/dashboard')
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'メールアドレスまたはパスワードが正しくありません';
        default:
          return 'エラーが発生しました';
      }
    }
    throw error;
  }
}
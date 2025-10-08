'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions/authenticate';

export default function LoginForm() {

  const [errorMessage, formAction] = useActionState(
    authenticate,
    undefined,
  );

  return (
    // mx-autoはmargin: 0 autoと同じ効果
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* shadcnの内容が一部変更になったみたい。Inputの幅が本当に最小限しか取得しなくなった。横幅が300px以上の時は最低でも300pxは保持するようにした */}
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            {/* <Input id="email" type="email" name="email" required className="w-full sm:min-w-[400px]" /> */}
            <Input id="email" type="email" name="email" required className="w-full min-w-2" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            {/* <Input id="password" type="password" name="password" required className="w-full sm:min-w-[400px]" /> */}
            <Input id="password" type="password" name="password" required className="w-full in-w-2" /> 
          </div>
          <Button type="submit" className="w-full">ログイン</Button>
          <div className="flex h-8 items-end space-x-1">
            {errorMessage && (
                <div>
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
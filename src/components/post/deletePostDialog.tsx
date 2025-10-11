import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { deletePost } from "@/lib/actions/deletePost"

type deletePostProps = {
  postId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void
}

export default function DeletePostDialog({postId, isOpen, onOpenChange}: deletePostProps) {

  return (
    <AlertDialog 
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>記事の削除</AlertDialogTitle>
          <AlertDialogDescription>
            この記事を削除してもよろしいですか？
            <br />
            この操作は取り消せません
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            // 即時実行関数形式にしておくとまだ関数を作成していなくてもエラーにならない用にできるってだけ。 
            onClick={() => deletePost(postId)}
            
            //　以下のように書くとエラー。以下の書き方だとこれは()がついているからで、()がついているとレンダリングされたタイミングで実行されちゃう
            // なので仮に引数なしの場合はonClick={deletePost}とかいてもonClick={() => deletePost()}とかいてもクリックされたタイミングで実行されるという解釈になる。
            // 引数付きのときだけ必ずonClick={() => deletePost(postId)}のように即時実行関数方式で書かないとエラーになる
            // onClick={deletePost(postId)}
            className="bg-red-500 hover:bg-red-600"
          >
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

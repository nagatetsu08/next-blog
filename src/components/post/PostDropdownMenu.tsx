'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

import DeletePostDialog from "./deletePostDialog"
import { useState } from "react"

export default function PostDropdownMenu({postId}: {postId: string}) {

  const [isDrowdownOpen, setIsDrowdownOpen] = useState(false)       // dropdownが開いているかの状態を管理する
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)   // deleteダイアログが表示されているか否かを管理する  

  const handleDeleteDialogChanged = (open: boolean) => {
    setShowDeleteDialog(open)
    // ダイアログが閉じたタイミングでdropdownも閉じるといこうことをさせたい
    if(!open) {
      setIsDrowdownOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu 
        open={isDrowdownOpen}
        // Stateのset関数を渡すだけで、DropdownMenuがOpen状態応じてtrue or falseを自動でセットしてくれる
        onOpenChange={setIsDrowdownOpen}
      >
        <DropdownMenuTrigger className="px-2 py-1 border rounded-md">⋯</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/manage/posts/${postId}`} className="cursor-pointer">詳細</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/manage/posts/${postId}/edit`} className="cursor-pointer">編集</Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600 cursor-pointer"
            // 即時実行関数
            onSelect={() => {
              setIsDrowdownOpen(false)
              setShowDeleteDialog(true)
            }}
          >
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showDeleteDialog && (
        <DeletePostDialog
          postId={postId}
          isOpen={showDeleteDialog}
          onOpenChange={handleDeleteDialogChanged}
        />
      )}
    </>
  )
}
